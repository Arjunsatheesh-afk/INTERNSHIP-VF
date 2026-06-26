import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, FlatList, Alert, ActivityIndicator,
  SafeAreaView, StatusBar, Dimensions
} from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND = 'http://192.168.1.10:5000';
const { width, height } = Dimensions.get('window');

// ── COLORS ──────────────────────────────────────────────
const C = {
  bg: '#0d1117', surface: '#161b22', surface2: '#1c2330',
  border: '#2a3441', accent: '#3fb950', accent2: '#f7c948',
  danger: '#f85149', warn: '#ff7b25', pulse: '#58a6ff',
  text: '#e6edf3', muted: '#7d8590', white: '#ffffff',
};

// ── HEALTH COLOR ─────────────────────────────────────────
function healthColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'fever' || s === 'stress') return C.danger;
  if (s === 'hypothermia') return C.accent2;
  if (s === 'lame') return C.warn;
  return C.accent;
}

// ════════════════════════════════════════════════════════
// TAB 1 — MAP (canvas-style dot view)
// ════════════════════════════════════════════════════════
function MapTab({ cattle, connected }) {
  const mapW = width - 32;
  const mapH = 320;

  return (
    <ScrollView style={s.tab}>
      {/* Status bar */}
      <View style={s.statusRow}>
        <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} />
        <Text style={s.statusText}>{connected ? 'LIVE' : 'DISCONNECTED'}</Text>
        <Text style={[s.statusText, { marginLeft: 'auto' }]}>
          {Object.keys(cattle).length} cattle
        </Text>
      </View>

      {/* Map canvas */}
      <View style={[s.mapBox, { width: mapW, height: mapH }]}>
        <Text style={s.mapLabel}>PASTURE MAP</Text>
        {/* Grid lines (decorative) */}
        {[0.25, 0.5, 0.75].map(p => (
          <View key={`h${p}`} style={[s.gridLineH, { top: mapH * p }]} />
        ))}
        {[0.25, 0.5, 0.75].map(p => (
          <View key={`v${p}`} style={[s.gridLineV, { left: mapW * p }]} />
        ))}

        {/* Cattle dots */}
        {Object.values(cattle).map(c => {
          const cx = (c.x / 100) * mapW;
          const cy = (c.y / 100) * mapH;
          const color = healthColor(c.health_status);
          return (
            <View
              key={c.cattle_id}
              style={[s.cattleDot, {
                left: cx - 8, top: cy - 8,
                backgroundColor: color,
              }]}
            >
              <Text style={s.cattleDotText}>{c.cattle_id}</Text>
            </View>
          );
        })}

        {Object.keys(cattle).length === 0 && (
          <Text style={s.mapEmpty}>Add cattle to see them on the map</Text>
        )}
      </View>

      {/* Legend */}
      <View style={s.card}>
        <Text style={s.cardTitle}>LEGEND</Text>
        {[
          { color: C.accent, label: 'Healthy' },
          { color: C.pulse, label: 'Lying Down' },
          { color: C.warn, label: 'Lameness' },
          { color: C.danger, label: 'Fever / Stress' },
          { color: C.accent2, label: 'Hypothermia' },
        ].map(item => (
          <View key={item.label} style={s.legendRow}>
            <View style={[s.legendDot, { backgroundColor: item.color }]} />
            <Text style={s.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════
// TAB 2 — CATTLE MANAGEMENT (add/remove)
// ════════════════════════════════════════════════════════
function CattleTab({ cattle, available, onAdd, onRemove, loading }) {
  const [search, setSearch] = useState('');
  const filtered = available.filter(id => String(id).includes(search));

  return (
    <View style={s.tab}>
      {/* Current herd */}
      <View style={s.card}>
        <Text style={s.cardTitle}>ACTIVE HERD ({Object.keys(cattle).length})</Text>
        {Object.keys(cattle).length === 0 ? (
          <Text style={s.muted}>No cattle added yet</Text>
        ) : (
          Object.values(cattle).map(c => (
            <View key={c.cattle_id} style={s.cattleRow}>
              <View style={[s.dot, { backgroundColor: healthColor(c.health_status) }]} />
              <Text style={s.cattleRowId}>#{c.cattle_id}</Text>
              <Text style={[s.cattleRowStatus, { color: healthColor(c.health_status) }]}>
                {c.health_status || 'HEALTHY'}
              </Text>
              <TouchableOpacity
                style={s.removeBtn}
                onPress={() => onRemove(c.cattle_id)}
              >
                <Text style={s.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Add cattle */}
      <View style={s.card}>
        <Text style={s.cardTitle}>ADD CATTLE (from dataset)</Text>
        <TextInput
          style={s.input}
          placeholder="Search ID..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          keyboardType="numeric"
        />
        <ScrollView style={{ maxHeight: 260 }}>
          {filtered.slice(0, 30).map(id => (
            <TouchableOpacity
              key={id}
              style={s.availableRow}
              onPress={() => onAdd(id)}
            >
              <Text style={s.availableId}>Cattle #{id}</Text>
              <Text style={s.addBtn}>+ ADD</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {loading && <ActivityIndicator color={C.accent} style={{ marginTop: 10 }} />}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// TAB 3 — PADDOCKS
// ════════════════════════════════════════════════════════
function PaddocksTab({ paddocks, onRefresh }) {
  const qualityColor = (q) => q >= 80 ? C.accent : q >= 65 ? C.accent2 : C.danger;

  return (
    <ScrollView style={s.tab}>
      <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
        <Text style={s.refreshBtnText}>↻ Refresh</Text>
      </TouchableOpacity>

      {paddocks.length === 0 ? (
        <View style={s.card}>
          <Text style={s.muted}>No paddocks available</Text>
        </View>
      ) : (
        paddocks.map(p => (
          <View key={p.id} style={[s.card, p.recommended && s.cardHighlight]}>
            <View style={s.paddockHeader}>
              <Text style={s.paddockName}>{p.name}</Text>
              <View style={[s.badge,
                p.recommended ? s.badgeRecommended :
                p.status === 'available' ? s.badgeAvailable :
                p.status === 'occupied' ? s.badgeOccupied : s.badgeRecovering
              ]}>
                <Text style={s.badgeText}>
                  {p.recommended ? '⭐ RECOMMENDED' : p.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={s.paddockRow}>
              <Text style={s.paddockLabel}>Area</Text>
              <Text style={s.paddockValue}>{p.area_hectares} ha</Text>
            </View>
            <View style={s.paddockRow}>
              <Text style={s.paddockLabel}>Grass Quality</Text>
              <Text style={[s.paddockValue, { color: qualityColor(p.grass_quality) }]}>
                {p.grass_quality}%
              </Text>
            </View>
            <View style={s.paddockRow}>
              <Text style={s.paddockLabel}>Grass Available</Text>
              <Text style={s.paddockValue}>{p.grass_available_kg} kg</Text>
            </View>
            <View style={s.paddockRow}>
              <Text style={s.paddockLabel}>Cattle / Capacity</Text>
              <Text style={s.paddockValue}>{p.cattle_count} / {p.capacity}</Text>
            </View>
            <View style={s.paddockRow}>
              <Text style={s.paddockLabel}>Days Resting</Text>
              <Text style={s.paddockValue}>{p.days_resting}</Text>
            </View>

            {/* Quality bar */}
            <View style={s.qualityBarBg}>
              <View style={[s.qualityBarFill, {
                width: `${p.grass_quality}%`,
                backgroundColor: qualityColor(p.grass_quality)
              }]} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════
// TAB 4 — SCHEDULE
// ════════════════════════════════════════════════════════
function ScheduleTab({ schedule, onRefresh }) {
  const days = Array.isArray(schedule?.schedule) ? schedule.schedule : [];
  const qualityColor = (q) => q >= 80 ? C.accent : q >= 65 ? C.accent2 : C.danger;

  return (
    <ScrollView style={s.tab}>
      <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
        <Text style={s.refreshBtnText}>↻ Refresh</Text>
      </TouchableOpacity>

      <View style={[s.card, { borderColor: C.accent2 }]}>
        <Text style={[s.cardTitle, { color: C.accent2 }]}>ROTATIONAL GRAZING PLAN</Text>
        <Text style={s.muted}>28-day cycle · ML-optimised rotation</Text>
      </View>

      {days.length === 0 ? (
        <View style={s.card}><Text style={s.muted}>Loading schedule...</Text></View>
      ) : (
        days.map((d, i) => (
          <View key={d.day} style={[s.card, i === 0 && s.cardHighlight]}>
            <View style={s.scheduleHeader}>
              <View style={s.scheduleDayNum}>
                <Text style={[s.scheduleDayNumText, { color: i === 0 ? C.accent2 : C.accent }]}>
                  {i === 0 ? 'NOW' : `D${i}`}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.scheduleDay}>{d.name}</Text>
                <Text style={[s.schedulePaddock]}>📍 {d.paddock_name}</Text>
                <Text style={s.scheduleDetail}>
                  {d.cattle_count} cattle · {d.duration_hours}h · {d.grass_available} kg
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.scheduleQuality, { color: qualityColor(d.grass_quality) }]}>
                  {d.grass_quality}%
                </Text>
                <Text style={s.muted}>quality</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════
// TAB 5 — HEALTH
// ════════════════════════════════════════════════════════
function HealthTab({ cattle }) {
  const cattleArr = Object.values(cattle);

  return (
    <ScrollView style={s.tab}>
      {cattleArr.length === 0 ? (
        <View style={s.card}>
          <Text style={s.muted}>Add cattle to monitor health</Text>
        </View>
      ) : (
        cattleArr.map(c => {
          const color = healthColor(c.health_status);
          return (
            <View key={c.cattle_id} style={[s.card, { borderLeftWidth: 3, borderLeftColor: color }]}>
              <View style={s.healthHeader}>
                <Text style={s.healthId}>🐄 Cattle #{c.cattle_id}</Text>
                <Text style={[s.healthStatus, { color }]}>{c.health_status || 'HEALTHY'}</Text>
              </View>

              <View style={s.healthRow}>
                <Text style={s.healthLabel}>Temperature</Text>
                <Text style={[s.healthValue, { color: c.temperature > 39.5 ? C.danger : C.text }]}>
                  {(c.temperature || 0).toFixed(1)}°C
                </Text>
              </View>
              <View style={s.healthRow}>
                <Text style={s.healthLabel}>Heart Rate</Text>
                <Text style={[s.healthValue, { color: c.heart_rate > 100 ? C.danger : C.text }]}>
                  {c.heart_rate || 0} bpm
                </Text>
              </View>
              <View style={s.healthRow}>
                <Text style={s.healthLabel}>Milk Production</Text>
                <Text style={s.healthValue}>{(c.milk_production || 0).toFixed(1)} L/day</Text>
              </View>
              <View style={s.healthRow}>
                <Text style={s.healthLabel}>Behavior</Text>
                <Text style={s.healthValue}>{c.behavior || '—'}</Text>
              </View>
              <View style={s.healthRow}>
                <Text style={s.healthLabel}>Position</Text>
                <Text style={s.healthValue}>
                  ({(c.x || 0).toFixed(0)}, {(c.y || 0).toFixed(0)})
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [cattle, setCattle] = useState({});
  const [available, setAvailable] = useState([]);
  const [paddocks, setPaddocks] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const TABS = [
    { id: 'map', label: '🗺 Map' },
    { id: 'cattle', label: '🐄 Cattle' },
    { id: 'paddocks', label: '🌾 Paddocks' },
    { id: 'schedule', label: '📅 Schedule' },
    { id: 'health', label: '❤️ Health' },
  ];

  // ── WebSocket ──
  useEffect(() => {
    const socket = io(BACKEND, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      fetchAll();
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('cattle_update', (data) => {
      if (data.cattle) {
        const d = {};
        data.cattle.forEach(c => { d[c.cattle_id] = c; });
        setCattle(d);
      }
    });

    socket.on('cattle_added', (data) => {
      if (data.cattle) {
        setCattle(prev => ({ ...prev, [data.cattle.cattle_id]: data.cattle }));
        fetchAvailable();
        fetchPaddocks();
      }
    });

    socket.on('cattle_removed', (data) => {
      if (data.cattle_id) {
        setCattle(prev => {
          const n = { ...prev };
          delete n[data.cattle_id];
          return n;
        });
        fetchAvailable();
        fetchPaddocks();
      }
    });

    return () => socket.disconnect();
  }, []);

  // ── Fetch helpers ──
  const fetchAll = () => {
    fetchCattle();
    fetchAvailable();
    fetchPaddocks();
    fetchSchedule();
  };

  const fetchCattle = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/cattle`);
      const d = {};
      r.data.cattle.forEach(c => { d[c.cattle_id] = c; });
      setCattle(d);
    } catch (e) { console.warn('fetchCattle error', e.message); }
  };

  const fetchAvailable = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/cattle/available`);
      setAvailable(r.data.available_cattle || []);
    } catch (e) { console.warn('fetchAvailable error', e.message); }
  };

  const fetchPaddocks = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/paddocks`);
      setPaddocks(r.data.paddocks || []);
    } catch (e) { console.warn('fetchPaddocks error', e.message); }
  };

  const fetchSchedule = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/schedule`);
      setSchedule(r.data);
    } catch (e) { console.warn('fetchSchedule error', e.message); }
  };

  // ── Add cattle ──
  const handleAdd = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND}/api/cattle`, { cattle_id: id });
      Alert.alert('✅ Added', `Cattle #${id} added to herd`);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to add cattle');
    }
    setLoading(false);
  };

  // ── Remove cattle ──
  const handleRemove = (id) => {
    Alert.alert(
      'Remove Cattle',
      `Remove cattle #${id} from herd?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${BACKEND}/api/cattle/${id}`);
            } catch (e) {
              Alert.alert('Error', 'Failed to remove cattle');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>🐄 VirtualHerd+</Text>
        <View style={s.headerRight}>
          <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} />
          <Text style={s.headerSub}>{connected ? 'LIVE' : 'OFFLINE'}</Text>
        </View>
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[s.tabBtn, activeTab === t.id && s.tabBtnActive]}
            onPress={() => setActiveTab(t.id)}
          >
            <Text style={[s.tabBtnText, activeTab === t.id && s.tabBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {activeTab === 'map' && <MapTab cattle={cattle} connected={connected} />}
      {activeTab === 'cattle' && (
        <CattleTab
          cattle={cattle}
          available={available}
          onAdd={handleAdd}
          onRemove={handleRemove}
          loading={loading}
        />
      )}
      {activeTab === 'paddocks' && (
        <PaddocksTab paddocks={paddocks} onRefresh={fetchPaddocks} />
      )}
      {activeTab === 'schedule' && (
        <ScheduleTab schedule={schedule} onRefresh={fetchSchedule} />
      )}
      {activeTab === 'health' && <HealthTab cattle={cattle} />}
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { color: C.accent, fontSize: 18, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerSub: { color: C.muted, fontSize: 12 },

  tabBar: {
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
    flexGrow: 0,
  },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: C.accent },
  tabBtnText: { color: C.muted, fontSize: 13, fontWeight: '600' },
  tabBtnTextActive: { color: C.accent },

  tab: { flex: 1, padding: 12 },

  card: {
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, padding: 14, marginBottom: 12,
  },
  cardHighlight: { borderColor: C.accent },
  cardTitle: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },

  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.surface2, borderRadius: 8, padding: 10, marginBottom: 12,
    borderWidth: 1, borderColor: C.border,
  },
  statusText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },

  // Map
  mapBox: {
    backgroundColor: '#0a1520', borderRadius: 10, marginBottom: 12,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden', position: 'relative',
  },
  mapLabel: {
    color: C.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1,
    position: 'absolute', top: 8, left: 10,
  },
  mapEmpty: {
    color: C.muted, textAlign: 'center', marginTop: 140, fontSize: 13,
  },
  gridLineH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(47,85,59,0.2)',
  },
  gridLineV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(47,85,59,0.2)',
  },
  cattleDot: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.4)',
  },
  cattleDotText: { color: '#fff', fontSize: 7, fontWeight: '700' },

  // Legend
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: C.text, fontSize: 13 },

  // Cattle tab
  cattleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  cattleRowId: { color: C.accent, fontWeight: '700', fontSize: 14, flex: 1 },
  cattleRowStatus: { fontSize: 12, fontWeight: '600' },
  removeBtn: { backgroundColor: C.danger, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  input: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, padding: 10, color: C.text, marginBottom: 10, fontSize: 14,
  },
  availableRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  availableId: { color: C.text, fontSize: 14 },
  addBtn: { color: C.accent, fontWeight: '700', fontSize: 13 },

  muted: { color: C.muted, fontSize: 13 },

  refreshBtn: {
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 12,
  },
  refreshBtnText: { color: C.accent, fontWeight: '600', fontSize: 13 },

  // Paddocks
  paddockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  paddockName: { color: C.accent, fontWeight: '700', fontSize: 15 },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeAvailable: { backgroundColor: 'rgba(63,185,80,0.2)' },
  badgeOccupied: { backgroundColor: 'rgba(88,166,255,0.2)' },
  badgeRecovering: { backgroundColor: 'rgba(255,123,37,0.2)' },
  badgeRecommended: { backgroundColor: 'rgba(247,201,72,0.2)' },
  badgeText: { fontSize: 10, fontWeight: '700', color: C.text },
  paddockRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  paddockLabel: { color: C.muted, fontSize: 13 },
  paddockValue: { color: C.text, fontWeight: '600', fontSize: 13 },
  qualityBarBg: { height: 5, backgroundColor: C.border, borderRadius: 3, marginTop: 10 },
  qualityBarFill: { height: 5, borderRadius: 3 },

  // Schedule
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleDayNum: {
    width: 40, height: 40, borderRadius: 8,
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
  },
  scheduleDayNumText: { fontWeight: '700', fontSize: 12 },
  scheduleDay: { color: C.text, fontWeight: '600', fontSize: 14, marginBottom: 2 },
  schedulePaddock: { color: C.accent, fontSize: 13, marginBottom: 2 },
  scheduleDetail: { color: C.muted, fontSize: 12 },
  scheduleQuality: { fontWeight: '700', fontSize: 16 },

  // Health
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  healthId: { color: C.text, fontWeight: '700', fontSize: 15 },
  healthStatus: { fontWeight: '700', fontSize: 13 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  healthLabel: { color: C.muted, fontSize: 13 },
  healthValue: { color: C.text, fontWeight: '600', fontSize: 13 },
});
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator, SafeAreaView,
  StatusBar, Dimensions, Modal
} from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND = 'http://192.168.1.8:5000';
const { width, height } = Dimensions.get('window');

const C = {
  bg: '#0d1117', surface: '#161b22', surface2: '#1c2330',
  border: '#2a3441', accent: '#3fb950', accent2: '#f7c948',
  danger: '#f85149', warn: '#ff7b25', pulse: '#58a6ff',
  text: '#e6edf3', muted: '#7d8590',
};

function healthColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'fever' || s === 'stress') return C.danger;
  if (s === 'hypothermia') return C.accent2;
  if (s === 'lame') return C.warn;
  return C.accent;
}

// ════════════════════════════════════════════════════════
// TAB 1 — MAP
// ════════════════════════════════════════════════════════
function MapTab({ cattle, connected, farmerPaddocks }) {
  const mapW = width - 32;
  const mapH = 300;

  return (
    <ScrollView style={s.tab}>
      <View style={s.statusRow}>
        <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} />
        <Text style={s.statusText}>{connected ? 'LIVE' : 'DISCONNECTED'}</Text>
        <Text style={[s.statusText, { marginLeft: 'auto' }]}>{Object.keys(cattle).length} cattle</Text>
      </View>

      <View style={[s.mapBox, { width: mapW, height: mapH }]}>
        <Text style={s.mapLabel}>PASTURE MAP</Text>
        {[0.25, 0.5, 0.75].map(p => (
          <View key={`h${p}`} style={[s.gridLineH, { top: mapH * p }]} />
        ))}
        {[0.25, 0.5, 0.75].map(p => (
          <View key={`v${p}`} style={[s.gridLineV, { left: mapW * p }]} />
        ))}

        {/* Draw farmer paddock boundaries */}
        {farmerPaddocks.map(p => p.points.map((pt, i) => {
          const x = (pt.x / 100) * mapW;
          const y = (pt.y / 100) * mapH;
          return (
            <View key={`${p.id}-${i}`} style={[s.fencePoint, { left: x - 4, top: y - 4 }]} />
          );
        }))}

        {Object.values(cattle).map(c => {
          const cx = (c.x / 100) * mapW;
          const cy = (c.y / 100) * mapH;
          return (
            <View key={c.cattle_id} style={[s.cattleDot, {
              left: cx - 8, top: cy - 8,
              backgroundColor: healthColor(c.health_status),
            }]}>
              <Text style={s.cattleDotText}>{c.cattle_id}</Text>
            </View>
          );
        })}

        {Object.keys(cattle).length === 0 && (
          <Text style={s.mapEmpty}>Add cattle to see them on the map</Text>
        )}
      </View>

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
// TAB 2 — CATTLE
// ════════════════════════════════════════════════════════
function CattleTab({ cattle, available, onAdd, onRemove, loading }) {
  const [search, setSearch] = useState('');
  const filtered = available.filter(id => String(id).includes(search));

  return (
    <View style={s.tab}>
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
              <TouchableOpacity style={s.removeBtn} onPress={() => onRemove(c.cattle_id)}>
                <Text style={s.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>ADD CATTLE FROM DATASET ({available.length} available)</Text>
        <TextInput
          style={s.input}
          placeholder="Search by ID..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          keyboardType="numeric"
        />
        <ScrollView style={{ maxHeight: 240 }}>
          {filtered.slice(0, 30).map(id => (
            <TouchableOpacity key={id} style={s.availableRow} onPress={() => onAdd(id)}>
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
// TAB 3 — DRAW FENCE
// ════════════════════════════════════════════════════════
function DrawFenceTab({ cattle, farmerPaddocks, onPaddockCreated }) {
  const [points, setPoints] = useState([]);
  const [paddockName, setPaddockName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedPaddock, setSelectedPaddock] = useState(null);
  const [selectedCattle, setSelectedCattle] = useState([]);

  const gridW = width - 32;
  const gridH = 280;

  const handleGridTap = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    const x = Math.round((locationX / gridW) * 100);
    const y = Math.round((locationY / gridH) * 100);
    setPoints([...points, { x, y }]);
  };

  const savePaddock = async () => {
    if (points.length < 3) {
      Alert.alert('Need more points', 'Tap at least 3 points to define a paddock boundary');
      return;
    }
    if (!paddockName.trim()) {
      Alert.alert('Name required', 'Give your paddock a name');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${BACKEND}/api/farmer/paddocks`, {
        name: paddockName.trim(),
        points: points,
      });
      Alert.alert('✅ Saved', `${paddockName} created successfully`);
      setPoints([]);
      setPaddockName('');
      onPaddockCreated();
    } catch (e) {
      Alert.alert('Error', 'Failed to save paddock');
    }
    setSaving(false);
  };

  const openAssign = (paddock) => {
    setSelectedPaddock(paddock);
    setSelectedCattle(paddock.cattle_ids || []);
    setShowAssign(true);
  };

  const assignCattle = async () => {
    try {
      await axios.post(`${BACKEND}/api/farmer/paddocks/${selectedPaddock.id}/assign`, {
        cattle_ids: selectedCattle,
      });
      Alert.alert('✅ Assigned', `${selectedCattle.length} cattle assigned to ${selectedPaddock.name}`);
      setShowAssign(false);
      onPaddockCreated();
    } catch (e) {
      Alert.alert('Error', 'Failed to assign cattle');
    }
  };

  const deletePaddock = (paddock) => {
    Alert.alert('Delete Paddock', `Delete "${paddock.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${BACKEND}/api/farmer/paddocks/${paddock.id}`);
            onPaddockCreated();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete');
          }
        }
      }
    ]);
  };

  const toggleCattle = (id) => {
    setSelectedCattle(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={s.tab}>
      {/* Grid drawing area */}
      <View style={s.card}>
        <Text style={s.cardTitle}>DRAW FENCE BOUNDARY</Text>
        <Text style={[s.muted, { marginBottom: 8, fontSize: 12 }]}>
          Tap on the grid to drop fence points ({points.length} points dropped)
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={handleGridTap}
          style={[s.drawGrid, { width: gridW - 28, height: gridH }]}
        >
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(p => (
            <View key={`gh${p}`} style={[s.gridLineH, { top: gridH * p, backgroundColor: 'rgba(63,185,80,0.15)' }]} />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map(p => (
            <View key={`gv${p}`} style={[s.gridLineV, { left: (gridW - 28) * p, backgroundColor: 'rgba(63,185,80,0.15)' }]} />
          ))}

          {/* Fence lines between points */}
          {points.length > 1 && points.map((pt, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            const x1 = (prev.x / 100) * (gridW - 28);
            const y1 = (prev.y / 100) * gridH;
            const x2 = (pt.x / 100) * (gridW - 28);
            const y2 = (pt.y / 100) * gridH;
            const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            return (
              <View key={`line${i}`} style={{
                position: 'absolute',
                left: x1, top: y1,
                width: len, height: 2,
                backgroundColor: C.accent2,
                transform: [{ rotate: `${angle}deg` }],
                transformOrigin: '0 0',
              }} />
            );
          })}

          {/* Close fence line */}
          {points.length > 2 && (() => {
            const first = points[0];
            const last = points[points.length - 1];
            const x1 = (last.x / 100) * (gridW - 28);
            const y1 = (last.y / 100) * gridH;
            const x2 = (first.x / 100) * (gridW - 28);
            const y2 = (first.y / 100) * gridH;
            const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            return (
              <View style={{
                position: 'absolute',
                left: x1, top: y1,
                width: len, height: 2,
                backgroundColor: C.accent2,
                opacity: 0.5,
                transform: [{ rotate: `${angle}deg` }],
                transformOrigin: '0 0',
              }} />
            );
          })()}

          {/* Points */}
          {points.map((pt, i) => {
            const x = (pt.x / 100) * (gridW - 28);
            const y = (pt.y / 100) * gridH;
            return (
              <View key={`pt${i}`} style={[s.fencePin, { left: x - 8, top: y - 8 }]}>
                <Text style={s.fencePinText}>{i + 1}</Text>
              </View>
            );
          })}

          {points.length === 0 && (
            <Text style={s.mapEmpty}>Tap here to drop fence points</Text>
          )}
        </TouchableOpacity>

        {/* Paddock name input */}
        <TextInput
          style={[s.input, { marginTop: 10 }]}
          placeholder="Paddock name (e.g. Pasture 1)"
          placeholderTextColor={C.muted}
          value={paddockName}
          onChangeText={setPaddockName}
        />

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: C.danger, flex: 1 }]}
            onPress={() => setPoints([])}
          >
            <Text style={s.actionBtnText}>↩ Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: C.accent, flex: 2 }]}
            onPress={savePaddock}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.actionBtnText}>💾 Save Paddock</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Saved paddocks */}
      <View style={s.card}>
        <Text style={s.cardTitle}>SAVED PADDOCKS ({farmerPaddocks.length})</Text>
        {farmerPaddocks.length === 0 ? (
          <Text style={s.muted}>No paddocks created yet. Draw a fence above.</Text>
        ) : (
          farmerPaddocks.map(p => (
            <View key={p.id} style={s.savedPaddock}>
              <View style={{ flex: 1 }}>
                <Text style={s.savedPaddockName}>{p.name}</Text>
                <Text style={s.muted}>
                  {p.points.length} fence points · {p.cattle_ids?.length || 0} cattle assigned
                </Text>
              </View>
              <TouchableOpacity
                style={[s.smallBtn, { backgroundColor: C.pulse, marginRight: 6 }]}
                onPress={() => openAssign(p)}
              >
                <Text style={s.smallBtnText}>Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.smallBtn, { backgroundColor: C.danger }]}
                onPress={() => deletePaddock(p)}
              >
                <Text style={s.smallBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Assign cattle modal */}
      <Modal visible={showAssign} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>
              Assign Cattle to {selectedPaddock?.name}
            </Text>
            <Text style={[s.muted, { marginBottom: 10 }]}>
              Tap cattle to select/deselect
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {Object.values(cattle).map(c => {
                const selected = selectedCattle.includes(c.cattle_id);
                return (
                  <TouchableOpacity
                    key={c.cattle_id}
                    style={[s.assignRow, selected && s.assignRowSelected]}
                    onPress={() => toggleCattle(c.cattle_id)}
                  >
                    <Text style={[s.assignId, selected && { color: C.accent }]}>
                      #{c.cattle_id}
                    </Text>
                    <Text style={[s.assignStatus, { color: healthColor(c.health_status) }]}>
                      {c.health_status || 'HEALTHY'}
                    </Text>
                    {selected && <Text style={{ color: C.accent, fontWeight: '700' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
              {Object.keys(cattle).length === 0 && (
                <Text style={s.muted}>Add cattle first from the Cattle tab</Text>
              )}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: C.border, flex: 1 }]}
                onPress={() => setShowAssign(false)}
              >
                <Text style={s.actionBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: C.accent, flex: 1 }]}
                onPress={assignCattle}
              >
                <Text style={s.actionBtnText}>Assign ({selectedCattle.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════
// TAB 4 — PADDOCKS (farmer-created only)
// ════════════════════════════════════════════════════════
function PaddocksTab({ farmerPaddocks, cattle, onRefresh }) {
  return (
    <ScrollView style={s.tab}>
      <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
        <Text style={s.refreshBtnText}>↻ Refresh</Text>
      </TouchableOpacity>

      {farmerPaddocks.length === 0 ? (
        <View style={s.card}>
          <Text style={[s.cardTitle, { marginBottom: 6 }]}>NO PADDOCKS YET</Text>
          <Text style={s.muted}>
            Go to the "Draw Fence" tab to create paddocks by tapping fence boundaries on the grid.
          </Text>
        </View>
      ) : (
        farmerPaddocks.map(p => {
          const assignedCattle = (p.cattle_ids || [])
            .map(id => cattle[id])
            .filter(Boolean);

          return (
            <View key={p.id} style={[s.card, p.status === 'occupied' && { borderColor: C.pulse }]}>
              <View style={s.paddockHeader}>
                <Text style={s.paddockName}>{p.name}</Text>
                <View style={[s.badge,
                  p.status === 'occupied' ? s.badgeOccupied : s.badgeAvailable
                ]}>
                  <Text style={s.badgeText}>{(p.status || 'available').toUpperCase()}</Text>
                </View>
              </View>

              <View style={s.paddockRow}>
                <Text style={s.paddockLabel}>Fence Points</Text>
                <Text style={s.paddockValue}>{p.points.length}</Text>
              </View>
              <View style={s.paddockRow}>
                <Text style={s.paddockLabel}>Cattle Assigned</Text>
                <Text style={s.paddockValue}>{p.cattle_ids?.length || 0}</Text>
              </View>
              <View style={s.paddockRow}>
                <Text style={s.paddockLabel}>Created</Text>
                <Text style={s.paddockValue}>
                  {p.created ? new Date(p.created).toLocaleDateString() : '—'}
                </Text>
              </View>

              {assignedCattle.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={[s.muted, { fontSize: 11, marginBottom: 4 }]}>ASSIGNED CATTLE:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {assignedCattle.map(c => (
                      <View key={c.cattle_id} style={[s.cattleChip, { borderColor: healthColor(c.health_status) }]}>
                        <Text style={[s.cattleChipText, { color: healthColor(c.health_status) }]}>
                          #{c.cattle_id}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })
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
        <View style={s.card}><Text style={s.muted}>Add cattle to monitor health</Text></View>
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
                <Text style={s.healthValue}>({(c.x || 0).toFixed(0)}, {(c.y || 0).toFixed(0)})</Text>
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
  const [farmerPaddocks, setFarmerPaddocks] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const TABS = [
    { id: 'map', label: '🗺 Map' },
    { id: 'cattle', label: '🐄 Cattle' },
    { id: 'fence', label: '📍 Draw Fence' },
    { id: 'paddocks', label: '🌾 Paddocks' },
    { id: 'health', label: '❤️ Health' },
  ];

  useEffect(() => {
    const socket = io(BACKEND, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => { setConnected(true); fetchAll(); });
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
      }
    });

    socket.on('cattle_removed', (data) => {
      if (data.cattle_id) {
        setCattle(prev => { const n = { ...prev }; delete n[data.cattle_id]; return n; });
        fetchAvailable();
      }
    });

    socket.on('paddock_created', () => fetchFarmerPaddocks());
    socket.on('paddock_updated', () => fetchFarmerPaddocks());
    socket.on('paddock_deleted', () => fetchFarmerPaddocks());

    return () => socket.disconnect();
  }, []);

  const fetchAll = () => {
    fetchCattle(); fetchAvailable(); fetchFarmerPaddocks();
  };

  const fetchCattle = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/cattle`);
      const d = {};
      r.data.cattle.forEach(c => { d[c.cattle_id] = c; });
      setCattle(d);
    } catch (e) { console.warn('fetchCattle', e.message); }
  };

  const fetchAvailable = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/cattle/available`);
      setAvailable(r.data.available_cattle || []);
    } catch (e) { console.warn('fetchAvailable', e.message); }
  };

  const fetchFarmerPaddocks = async () => {
    try {
      const r = await axios.get(`${BACKEND}/api/farmer/paddocks`);
      setFarmerPaddocks(r.data.paddocks || []);
    } catch (e) { console.warn('fetchFarmerPaddocks', e.message); }
  };

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

  const handleRemove = (id) => {
    Alert.alert('Remove Cattle', `Remove cattle #${id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          try { await axios.delete(`${BACKEND}/api/cattle/${id}`); }
          catch (e) { Alert.alert('Error', 'Failed to remove'); }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.header}>
        <Text style={s.headerTitle}>🐄 VirtualHerd+</Text>
        <View style={s.headerRight}>
          <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} />
          <Text style={s.headerSub}>{connected ? 'LIVE' : 'OFFLINE'}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[s.tabBtn, activeTab === t.id && s.tabBtnActive]}
            onPress={() => setActiveTab(t.id)}
          >
            <Text style={[s.tabBtnText, activeTab === t.id && s.tabBtnTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeTab === 'map' && <MapTab cattle={cattle} connected={connected} farmerPaddocks={farmerPaddocks} />}
      {activeTab === 'cattle' && <CattleTab cattle={cattle} available={available} onAdd={handleAdd} onRemove={handleRemove} loading={loading} />}
      {activeTab === 'fence' && <DrawFenceTab cattle={cattle} farmerPaddocks={farmerPaddocks} onPaddockCreated={fetchFarmerPaddocks} />}
      {activeTab === 'paddocks' && <PaddocksTab farmerPaddocks={farmerPaddocks} cattle={cattle} onRefresh={fetchFarmerPaddocks} />}
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
  tabBar: { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, flexGrow: 0 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: C.accent },
  tabBtnText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  tabBtnTextActive: { color: C.accent },
  tab: { flex: 1, padding: 12 },
  card: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.surface2, borderRadius: 8, padding: 10, marginBottom: 12,
    borderWidth: 1, borderColor: C.border,
  },
  statusText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  mapBox: { backgroundColor: '#0a1520', borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden', position: 'relative' },
  mapLabel: { color: C.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1, position: 'absolute', top: 8, left: 10 },
  mapEmpty: { color: C.muted, textAlign: 'center', marginTop: 120, fontSize: 13 },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(47,85,59,0.2)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(47,85,59,0.2)' },
  cattleDot: { position: 'absolute', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.4)' },
  cattleDotText: { color: '#fff', fontSize: 7, fontWeight: '700' },
  fencePoint: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: C.text, fontSize: 13 },
  cattleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  cattleRowId: { color: C.accent, fontWeight: '700', fontSize: 14, flex: 1 },
  cattleRowStatus: { fontSize: 12, fontWeight: '600' },
  removeBtn: { backgroundColor: C.danger, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, color: C.text, marginBottom: 10, fontSize: 14 },
  availableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  availableId: { color: C.text, fontSize: 14 },
  addBtn: { color: C.accent, fontWeight: '700', fontSize: 13 },
  muted: { color: C.muted, fontSize: 13 },
  drawGrid: { backgroundColor: '#0a1520', borderRadius: 8, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  fencePin: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#000' },
  fencePinText: { color: '#000', fontSize: 8, fontWeight: '700' },
  actionBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  savedPaddock: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  savedPaddockName: { color: C.accent, fontWeight: '700', fontSize: 14 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  smallBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  refreshBtn: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 12 },
  refreshBtnText: { color: C.accent, fontWeight: '600', fontSize: 13 },
  paddockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  paddockName: { color: C.accent, fontWeight: '700', fontSize: 15 },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeAvailable: { backgroundColor: 'rgba(63,185,80,0.2)' },
  badgeOccupied: { backgroundColor: 'rgba(88,166,255,0.2)' },
  badgeText: { fontSize: 10, fontWeight: '700', color: C.text },
  paddockRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  paddockLabel: { color: C.muted, fontSize: 13 },
  paddockValue: { color: C.text, fontWeight: '600', fontSize: 13 },
  cattleChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  cattleChipText: { fontSize: 11, fontWeight: '600' },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  healthId: { color: C.text, fontWeight: '700', fontSize: 15 },
  healthStatus: { fontWeight: '700', fontSize: 13 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  healthLabel: { color: C.muted, fontSize: 13 },
  healthValue: { color: C.text, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: C.surface2, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: C.border },
  modalTitle: { color: C.accent, fontWeight: '700', fontSize: 16, marginBottom: 6 },
  assignRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 },
  assignRowSelected: { backgroundColor: 'rgba(63,185,80,0.1)', borderRadius: 6, paddingHorizontal: 6 },
  assignId: { color: C.text, fontWeight: '600', flex: 1 },
  assignStatus: { fontSize: 12 },
});
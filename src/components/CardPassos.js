import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Pedometer } from 'expo-sensors';
import { Feather, Ionicons } from '@expo/vector-icons';

const META_PASSOS = 10000;

export default function CardPassos() {
  const [passos, setPassos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [tipoSensor, setTipoSensor] = useState('verificando');
  const [mensagem, setMensagem] = useState('');
  const subscriptionRef = useRef(null);
  const lastStepTime = useRef(0);
  const wasAboveThreshold = useRef(false);

  useEffect(() => {
    async function detectarSensor() {
      try {
        const disponivel = await Pedometer.isAvailableAsync();
        setTipoSensor(disponivel ? 'pedometer' : 'accelerometer');
      } catch {
        setTipoSensor('accelerometer');
      }
    }

    detectarSensor();
    return () => subscriptionRef.current?.remove();
  }, []);

  function iniciarAcelerometro() {
    try {
      setTipoSensor('accelerometer');
      Accelerometer.setUpdateInterval(50);
      subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const agora = Date.now();

        if (magnitude > 1.18 && !wasAboveThreshold.current && agora - lastStepTime.current > 260) {
          wasAboveThreshold.current = true;
          lastStepTime.current = agora;
          setPassos((valor) => valor + 1);
        } else if (magnitude < 1.1 || agora - lastStepTime.current > 350) {
          wasAboveThreshold.current = false;
        }
      });
      setAtivo(true);
    } catch {
      setMensagem('Não foi possível iniciar o sensor de movimento.');
    }
  }

  async function alternarContador() {
    if (ativo) {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      setAtivo(false);
      return;
    }

    setMensagem('');
    if (tipoSensor === 'pedometer') {
      try {
        const permissao = await Pedometer.requestPermissionsAsync();
        if (!permissao.granted) {
          iniciarAcelerometro();
          return;
        }

        subscriptionRef.current = Pedometer.watchStepCount(({ steps }) => setPassos(steps));
        setAtivo(true);
        return;
      } catch {
        iniciarAcelerometro();
        return;
      }
    }

    iniciarAcelerometro();
  }

  function zerarPassos() {
    setPassos(0);
  }

  const porcentagemMeta = Math.min((passos / META_PASSOS) * 100, 100);
  const sensorTexto = tipoSensor === 'pedometer' ? 'Pedômetro nativo' : 'Acelerômetro do aparelho';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={styles.iconBadge}>
            <Feather name="activity" size={17} color="#059669" />
          </View>
          <Text style={styles.cardTitle}>Contador de passos</Text>
        </View>
        <Text style={styles.goalText}>Meta: 10.000</Text>
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.dataLabel}>PASSOS REALIZADOS</Text>
        <Text style={styles.steps}>{passos.toLocaleString('pt-BR')}</Text>
        <Text style={styles.stepsLabel}>passos hoje</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${Math.max(porcentagemMeta, passos > 0 ? 3 : 0)}%` }]} />
      </View>
      <Text style={styles.progressText}>{Math.round(porcentagemMeta)}% da meta diária</Text>

      <View style={styles.sensorPill}>
        <Ionicons name={tipoSensor === 'pedometer' ? 'footsteps-outline' : 'pulse-outline'} size={15} color="#0F766E" />
        <Text style={styles.sensorText}>{tipoSensor === 'verificando' ? 'Verificando sensor...' : sensorTexto}</Text>
        <View style={styles.sensorDot} />
      </View>

      {mensagem ? <Text style={styles.errorText}>{mensagem}</Text> : null}

      <View style={styles.actionsRow}>
        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={alternarContador}>
          <Ionicons name={ativo ? 'pause' : 'play'} size={16} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>{ativo ? 'Pausar contagem' : 'Começar a contar'}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]} onPress={zerarPassos} accessibilityLabel="Zerar passos">
          <Ionicons name="refresh-outline" size={19} color="#0F766E" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E6EEEA', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 14, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#DFF7ED', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  goalText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  centerContent: { alignItems: 'center' },
  dataLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: '#94A3B8' },
  steps: { color: '#0F172A', fontSize: 54, lineHeight: 62, fontWeight: '800', marginTop: 4 },
  stepsLabel: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  progressTrack: { height: 9, borderRadius: 6, backgroundColor: '#E2E8F0', overflow: 'hidden', marginTop: 22 },
  progressBar: { height: '100%', borderRadius: 6, backgroundColor: '#10B981' },
  progressText: { color: '#64748B', fontSize: 12, textAlign: 'right', marginTop: 7 },
  sensorPill: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDFA', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginTop: 17 },
  sensorText: { color: '#0F766E', fontSize: 12, fontWeight: '600', marginHorizontal: 7 },
  sensorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  errorText: { color: '#DC2626', fontSize: 12, textAlign: 'center', marginTop: 12 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 19 },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: '#0F766E', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  resetButton: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#B7E5D3', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});

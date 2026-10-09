import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import CardLocalizacao from './src/components/CardLocalizacao';
import CardPassos from './src/components/CardPassos';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTopline}>
            <View style={styles.brandMark}>
              <Ionicons name="footsteps" size={20} color="#0F172A" />
            </View>
            <Text style={styles.brand}>GEO PASSOS</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>
          </View>
          <Text style={styles.greeting}>Seu movimento de hoje</Text>
          <Text style={styles.heroTitle}>Caminhe mais longe.</Text>
          <Text style={styles.heroSubtitle}>Acompanhe seus passos e registre onde sua jornada acontece.</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionEyebrow}>PAINEL DE HOJE</Text>
              <Text style={styles.sectionTitle}>Seu progresso</Text>
            </View>
            <View style={styles.dateBadge}>
              <Feather name="calendar" size={14} color="#0F766E" />
              <Text style={styles.dateText}>Hoje</Text>
            </View>
          </View>

          <CardPassos />
          <CardLocalizacao />

          <View style={styles.footerNote}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#0F766E" />
            <Text style={styles.footerText}>Seus dados ficam no seu dispositivo.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  scrollContent: { paddingBottom: 28 },
  hero: { backgroundColor: '#0F172A', paddingTop: 58, paddingHorizontal: 22, paddingBottom: 34, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroTopline: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brand: { color: '#E2E8F0', fontSize: 13, fontWeight: '800', letterSpacing: 1.8 },
  liveBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399', marginRight: 6 },
  liveText: { color: '#A7F3D0', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  greeting: { color: '#94A3B8', fontSize: 14, marginTop: 34, marginBottom: 8 },
  heroTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: 0 },
  heroSubtitle: { color: '#CBD5E1', fontSize: 15, lineHeight: 22, marginTop: 10, maxWidth: 330 },
  content: { paddingHorizontal: 16, paddingTop: 26 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  sectionEyebrow: { color: '#0F766E', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  sectionTitle: { color: '#0F172A', fontSize: 24, fontWeight: '800' },
  dateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DFF7ED', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 8, marginBottom: 2 },
  dateText: { color: '#0F766E', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  footerNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  footerText: { color: '#64748B', fontSize: 12, marginLeft: 6 },
});

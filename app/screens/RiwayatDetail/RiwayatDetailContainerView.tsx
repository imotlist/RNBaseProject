/**
 * RiwayatDetailContainerView.tsx
 *
 * Presentational component for RiwayatDetail screen.
 * Contains UI for displaying plant monitoring detail.
 *
 * @module screens/RiwayatDetail
 */

import React from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { IconPack } from "@/components/ui/IconPack"
import { Avatar } from "@/components/ui/Avatar"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import type { MonitoringDetail } from "./RiwayatDetailContainer"
import { Frame, ImageViewer } from "@/components/ui"

// ============================================================================
// Types
// ============================================================================

export interface RiwayatDetailContainerViewProps {
  isLoading: boolean
  isDeleting: boolean
  detail: MonitoringDetail | null
  error: string | null
  onBack: () => void
  onDelete: () => void
  onRetry: () => void
  onViewPlantHistory?: () => void
}

// ============================================================================
// Helper Functions
// ============================================================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ============================================================================
// View Component
// ============================================================================

const RiwayatDetailContainerView: React.FC<RiwayatDetailContainerViewProps> = ({
  isLoading,
  isDeleting,
  detail,
  error,
  onBack,
  onDelete,
  onRetry,
  onViewPlantHistory,
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  // Loading state
  if (isLoading) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.palette.primary500} />
          <Text style={styles.loadingText}>Memuat detail...</Text>
        </View>
      </Screen>
    )
  }

  // Error state
  if (error && !detail) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <View style={styles.centerContainer}>
          <IconPack name="danger" size={scale(64)} color="#EF4444" />
          <Text preset="heading" style={styles.errorTitle}>
            Gagal Memuat
          </Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            text="Coba Lagi"
            onPress={onRetry}
            color="primary"
            rounded="full"
            style={styles.retryButton}
          />
        </View>
      </Screen>
    )
  }

  if (!detail) {
    return null
  }

  const isHealthy = detail.status_tanaman === "Sehat"
  const statusColor = isHealthy ? "#4CAF50" : "#EF4444"
  const statusBg = isHealthy ? "#E8F5E9" : "#FFEBEE"

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <IconPack name="arrowLeft" size={scale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text preset="heading" style={styles.headerTitle}>
          Bukti Hasil Perawatan
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} disabled={isDeleting}>
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <IconPack name="trash" size={scale(20)} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}

        {/* Plant Info Card */}
        <View style={[styles.card, { backgroundColor: "#fff" }]}>
          <View style={styles.plantHeader}>
            <View style={styles.plantInfo}>
              <Text style={styles.plantCode}>
                {detail.plant_code || "Tanaman"} • {detail.plant_name}
              </Text>
              {detail.region_info && (
                <Text style={styles.plantLocation}>
                  Zona {detail.region_info}
                </Text>
              )}
              <View style={[{ flexDirection: 'row' }]}>
                <Text size="xs">{formatDate(detail.created_at)}</Text>
                <Text size="xs">{formatTime(detail.created_at)}</Text>
              </View>
            </View>
            {/* Plant History Button */}
            {onViewPlantHistory && (
              <TouchableOpacity style={styles.historyButton} onPress={onViewPlantHistory}>
                <IconPack name="clock" size={scale(20)} color={colors.palette.primary500} />
              </TouchableOpacity>
            )}
          </View>

          {/* Date Badge */}

        </View>



        {/* Details Card */}
        <Frame color="primary" rounded="md" style={{ gap: scale(14) }}>
          <Text size="md" weight="medium">{formatDate(detail.created_at)}</Text>
          <Text size="sm">{`Dilakukan perawatan oleh ${detail.user?.name}`}</Text>
          <View style={[styles.card, { backgroundColor: "#fff", gap: scale(14) }]}>
            {detail.plant_name && (
              <DetailRow
                icon={require('@assets/images/IconTree.png')}
                label="Nama Tanaman"
                value={detail.plant_name}
                colors={colors}
              />
            )}
            {detail.status_tanaman && (
              <DetailRow
                icon={require('@assets/images/IconStatus.png')}
                label="Status Tanaman"
                value={detail.status_tanaman}
                colors={colors}
              />
            )}
            {/* Jarak Tanam */}
            {detail.jarak_tanam && (
              <DetailRow
                icon={require('@assets/images/IconJarak.png')}
                label="Jarak Tanam"
                value={detail.jarak_tanam}
                colors={colors}
              />
            )}

            {/* Ajir */}
            {detail.ajir && (
              <DetailRow
                icon={require('@assets/images/IconAjir.png')}
                label="Ajir"
                value={detail.ajir}
                colors={colors}
              />
            )}

            {/* Kebersihan Piringan */}
            {detail.kebersihan_piringan && (
              <DetailRow
                icon={require('@assets/images/IconKebersihan.png')}
                label="Kebersihan Piringan"
                value={detail.kebersihan_piringan}
                colors={colors}
              />
            )}

            {/* Kebersihan Piringan */}
            {detail.indikasi_gagal && (
              <DetailRow
                icon={require('@assets/images/IconEstimasi.png')}
                label="Indikasi Gagal Tumbuh"
                value={detail.indikasi_gagal}
                colors={colors}
              />
            )}

            {/* Indikasi Gagal */}
            {detail.indikasi_gagal && (
              <DetailRow
                icon={require('@assets/images/IconIndikasi.png')}
                label="Indikasi Gagal"
                value={detail.indikasi_gagal}
                valueColor="#EF4444"
                colors={colors}
              />
            )}

            {/* Estimasi Tinggi */}
            {detail.estimasi_tinggi && (
              <DetailRow
                icon={require('@assets/images/IconEstimasi.png')}
                label="Estimasi Tinggi"
                value={detail.estimasi_tinggi}
                colors={colors}
              />
            )}
            {/* Estimasi Tinggi */}
            {detail.tinggi_tanaman && (
              <DetailRow
                icon={require('@assets/images/IconTinggi.png')}
                label="Tinggi Spesifik"
                value={detail.tinggi_tanaman}
                colors={colors}
              />
            )}

            {/* Location */}
            <DetailRow
              icon={require('@assets/images/IconTree.png')}
              label="Lokasi"
              value={`${detail.latitude}, ${detail.longitude}`}
              colors={colors}
            />
            {detail.catatan && (
              <View style={[{ backgroundColor: "#fff" }]}>
                <View style={styles.cardHeader}>
                  <Image source={require('@assets/images/IconCatatan.png')} style={{ width: scale(20), height: scale(20) }} />
                  <Text style={styles.cardTitle}>Catatan</Text>
                </View>
                <View style={{paddingLeft:scale(28)}}>
                  <Text style={styles.notesText}>{detail.catatan}</Text>
                </View>
              </View>
            )}

            {/* Image Section */}
            {detail.image_url && (
              <View style={[styles.card, styles.imageCard, { backgroundColor: "#fff" }]}>
                <ImageViewer source={{ uri: detail.image_url }} style={styles.plantImage} resizeMode="cover" />
                {detail.verified_by_ai && (
                  <View style={[styles.aiBadge, { backgroundColor: "#fff" }]}>
                    <IconPack name="magic" size={scale(14)} color={colors.tint} />
                    <Text style={[styles.aiBadgeText, { color: colors.tint }]}>
                      Diverifikasi AI
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

        </Frame>


        {/* Notes Card */}


        {/* Petugas Card */}
        {detail.petugas && (
          <View style={[styles.card, { backgroundColor: "#fff" }]}>
            <Text style={styles.petugasLabel}>Dilakukan Perawatan oleh</Text>
            <View style={styles.petugasInfo}>
              <Avatar
                size="medium"
                text={detail.petugas.name?.charAt(0) || "?"}
                source={detail.petugas.avatar}
              />
              <Text style={styles.petugasName}>{detail.petugas.name}</Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            text="Tambah Perawatan Baru"
            onPress={() => {
              // Navigate to Penanaman screen
              console.log("Navigate to Penanaman")
            }}
            color="primary"
            rounded="full"
            size="large"
            style={styles.actionButton}
            LeftAccessory={() => (
              <IconPack name="add" size={scale(20)} color="#fff" />
            )}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  )
}

// ============================================================================
// Detail Row Component
// ============================================================================

interface DetailRowProps {
  icon: any
  label: string
  value: any
  valueColor?: string
  colors: any
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, valueColor, colors }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <Image source={icon} style={{ width: scale(20), height: scale(20) }} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={[styles.detailValue, valueColor ? { color: valueColor } : {}]}>
      {value}
    </Text>
  </View>
)

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12)
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
  },
  loadingText: {
    marginTop: scale(16),
    fontSize: scaleFontSize(14),
    color: "#666",
  },
  errorTitle: {
    fontSize: scaleFontSize(20),
    marginBottom: scale(8),
  },
  errorMessage: {
    fontSize: scaleFontSize(14),
    color: "#666",
    textAlign: "center",
    marginBottom: scale(20),
  },
  retryButton: {
    minWidth: scale(120),
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "600",
  },
  deleteButton: {
    padding: scale(8),
  },
  // Card
  card: {
    marginBottom: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Plant Info
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: scale(12),
  },
  plantInfo: {
    flex: 1,
  },
  historyButton: {
    padding: scale(8),
    marginLeft: scale(8),
    borderRadius: scale(20),
    backgroundColor: "#F0F9FF",
  },
  plantCode: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  plantLocation: {
    fontSize: scaleFontSize(13),
    color: "#666",
    marginBottom: scale(2),
  },
  plantCoords: {
    fontSize: scaleFontSize(11),
    color: "#999",
  },
  dateBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(8),
  },
  dateText: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    color: "#2E7D32",
  },
  timeText: {
    fontSize: scaleFontSize(11),
    color: "#666",
    marginTop: scale(2),
  },
  // Image
  imageCard: {
    padding: 0,
    overflow: "hidden",
  },
  plantImage: {
    width: "100%",
    height: scale(200),
  },
  aiBadge: {
    position: "absolute",
    bottom: scale(12),
    right: scale(12),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  aiBadgeText: {
    fontSize: scaleFontSize(11),
    fontWeight: "600",
    marginLeft: scale(4),
  },
  // Card Header
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
    gap: scale(8),
  },
  cardTitle: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
  },
  // Status
  statusBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(20),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(8),
  },
  statusTextLarge: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
  },
  // Detail Row
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  detailLabel: {
    fontSize: scaleFontSize(14),
    color: "#666",
  },
  detailValue: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
  },
  // Notes
  notesText: {
    fontSize: scaleFontSize(14),
    color: "#333",
    lineHeight: scale(22),
  },
  // Petugas
  petugasLabel: {
    fontSize: scaleFontSize(13),
    color: "#666",
    marginBottom: scale(12),
  },
  petugasInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  petugasName: {
    fontSize: scaleFontSize(15),
    fontWeight: "500",
  },
  // Action
  actionContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: scale(16),
  },
  actionButton: {
    width: "100%",
  },
  bottomSpacer: {
    height: scale(24),
  },
})

export default RiwayatDetailContainerView

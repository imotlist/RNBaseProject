/**
 * ProfileScreenView.tsx
 *
 * Presentational component for Profile screen.
 * Displays user profile information and settings.
 *
 * @module screens/Profile
 */

import React, { useState } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Dimensions } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui/IconPack/IconPack"
import { scale, scaleFontSize } from "@/utils/responsive"
import type { ProfileScreenViewProps } from "./Profile"

// ============================================================================
// View Component
// ============================================================================

const ProfileScreenView: React.FC<ProfileScreenViewProps> = ({
  user,
  isLoading,
  city,
  onLogout,
  onRefresh,
  onEditProfile,
  onChangeDistrict,
}) => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const userName = user?.name || user?.username || "Guest User"
  const userEmail = user?.email || "guest@example.com"
  const avatarText = userName.charAt(0).toUpperCase()

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Profil Saya</Text>

        {/* Profile Picture */}
        <View style={[styles.avatarContainer, {marginBottom:scale(40)}]}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: "#E0E0E0" }]}>
              <Text style={styles.avatarText}>{avatarText}</Text>
            </View>
          )}
        </View>

        {/* Account Info Card */}
        <View style={[styles.card, { borderColor: "#E8F5E9" }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informasi Akun</Text>
            {onEditProfile && (
              <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Nama Lengkap" value={userName} />
            <InfoRow label="Email" value={userEmail} />
            <InfoRow label="Password" value="********" />
          </View>
        </View>

        {/* District Info Card */}
        <View style={[styles.card, { borderColor: "#E8F5E9" }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informasi Kabupaten</Text>
            {onChangeDistrict && (
              <TouchableOpacity style={styles.editButton} onPress={onChangeDistrict}>
                <Text style={styles.editButtonText}>Ubah Kabupaten</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Kode Kabupaten" value={city?.id ? `KAB-${city.id.slice(0, 8)}...` : "-"} />
            <InfoRow label="Nama Kabupaten" value={city?.name || "-"} />
            <InfoRow
              label="Koordinat"
              value={city?.latitude && city?.longitude ? `${city.latitude}, ${city.longitude}` : "-"}
            />
          </View>
        </View>

        {/* Logout & Version */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <IconPack name="logout" size={scale(20)} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version Apps v1.5</Text>
      </ScrollView>
    </Screen>
  )
}

// ============================================================================
// Subcomponents
// ============================================================================

interface InfoRowProps {
  label: string
  value: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <IconPack name="tickCircle" size={scale(16)} color="#8BC34A" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(16),
    minHeight: Dimensions.get('window').height
  },
  headerTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: scale(16),
  },
  avatarImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: "#E0E0E0",
  },
  avatarPlaceholder: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  avatarText: {
    fontSize: scaleFontSize(48),
    fontWeight: "600",
    color: "#666666",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(16),
    marginBottom: scale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(16),
  },
  cardTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: "bold",
    color: "#333333",
  },
  editButton: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: "#8BC34A",
  },
  editButtonText: {
    fontSize: scaleFontSize(12),
    fontWeight: "600",
    color: "#8BC34A",
  },
  cardContent: {
    gap: scale(12),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  infoLabel: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
    color: "#333333",
  },
  infoValue: {
    fontSize: scaleFontSize(14),
    color: "#666666",
    flex: 1,
    textAlign: "right",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(16),
    marginBottom: scale(8),
    gap: scale(8),
  },
  logoutText: {
    fontSize: scaleFontSize(16),
    fontWeight: "500",
    color: "#E53935",
  },
  versionText: {
    fontSize: scaleFontSize(12),
    color: "#666666",
    textAlign: "center",
    marginBottom: scale(32),
  },
})

export default ProfileScreenView

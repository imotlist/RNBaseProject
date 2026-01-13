/**
 * PenanamanContainerView.tsx
 *
 * Presentational component for Penanaman container screen.
 * Contains UI for plant monitoring form with image upload.
 *
 * @module screens/Penanaman
 */

import React, { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Pressable, Image, TextInput as RNTextInput, Modal, Dimensions } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { IconPack } from "@/components/ui/IconPack"
import { Frame } from "@/components/ui/Frame"
import { Avatar } from "@/components/ui/Avatar"
import { TextField } from "@/components/TextField"
import { Dropdown } from "@/components/ui"
import type { DropdownOption } from "@/components/ui"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import { Formik } from "formik"
import * as ImagePicker from "react-native-image-picker"
import { useIsFocused } from "@react-navigation/native"
import type { TanamanFormValues } from "./PenanamanContainer"

// ============================================================================
// Types
// ============================================================================

export interface PenanamanContainerViewProps {
  isLoading: boolean
  onSubmit: (values: TanamanFormValues) => Promise<void>
  initialLocation?: { latitude: string; longitude: string }
  onGetLocation: () => Promise<{ latitude: string; longitude: string } | null>
}

// ============================================================================
// Form Config
// ============================================================================

const INITIAL_VALUES: TanamanFormValues = {
  image: null,
  imageFile: null,
  nama_tanaman: "",
  status_tanaman: "",
  jarak_tanam: "",
  ajir: "",
  kebersihan_piringan: "",
  indikasi_gagal: "",
  estimasi_tinggi: "",
  catatan: "",
  latitude: "-6.200000",
  longitude: "106.816666",
}

// Dropdown options
const STATUS_OPTIONS: DropdownOption[] = [
  { label: "Pilih Status", value: "" },
  { label: "Sehat", value: "Sehat" },
  { label: "Mati", value: "Mati" },
]

const JARAK_TANAM_OPTIONS: DropdownOption[] = [
  { label: "Pilih Jarak", value: "" },
  { label: "3x3", value: "3x3" },
  { label: "4x4", value: "4x4" },
  { label: "5x5", value: "5x5" },
  { label: "6x6", value: "6x6" },
]

const AJIR_OPTIONS: DropdownOption[] = [
  { label: "Pilih Ajir", value: "" },
  { label: "Ada", value: "Ada" },
  { label: "Tidak", value: "Tidak" },
]

const KEBERSIHAN_OPTIONS: DropdownOption[] = [
  { label: "Pilih Kebersihan", value: "" },
  { label: "Bersih", value: "Bersih" },
  { label: "Kotor", value: "Kotor" },
]

const INDIKASI_GAGAL_OPTIONS: DropdownOption[] = [
  { label: "Pilih Indikasi", value: "" },
  { label: "Terbakar", value: "terbakar" },
  { label: "Kekeringan", value: "kekeringan" },
  { label: "Longsor", value: "longsor" },
]

const ESTIMASI_TINGGI_OPTIONS: DropdownOption[] = [
  { label: "Pilih Estimasi", value: "" },
  { label: "Lebih dari 50cm", value: ">50" },
  { label: "Lebih dari 75cm", value: ">75" },
  { label: "Lebih dari 100cm", value: ">100" },
]

// ============================================================================
// View Component
// ============================================================================

const PenanamanContainerView: React.FC<PenanamanContainerViewProps> = ({
  isLoading,
  onSubmit,
  initialLocation,
  onGetLocation,
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const statusBarColor = colors.palette.primary700
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()

  // Form states
  const [namaTanaman, setNamaTanaman] = useState("")
  const [statusTanaman, setStatusTanaman] = useState("")
  const [jarakTanam, setJarakTanam] = useState("")
  const [ajir, setAjir] = useState("")
  const [kebersihanPiringan, setKebersihanPiringan] = useState("")
  const [indikasiGagal, setIndikasiGagal] = useState("")
  const [estimasiTinggi, setEstimasiTinggi] = useState("")
  const [catatan, setCatatan] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [location, setLocation] = useState({ latitude: "-6.200000", longitude: "106.816666" })

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation)
    }
  }, [initialLocation])

  // Handle image pick
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        selectionLimit: 1,
      })

      if (result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri || null)
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  }

  // Handle camera
  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCamera({
        mediaType: "photo",
        quality: 0.8,
      })

      if (result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri || null)
      }
    } catch (error) {
      console.error("Error opening camera:", error)
    }
  }

  // Handle get location
  const handleGetLocation = async () => {
    try {
      const loc = await onGetLocation()
      if (loc) {
        setLocation(loc)
        Alert.alert("Success", `Location captured: ${loc.latitude}, ${loc.longitude}`)
      }
    } catch (error) {
      console.error("Error getting location:", error)
    }
  }

  // Handle submit
  const handleSubmit = async () => {
    // Validate all required fields
    if (!imageUri) {
      Alert.alert("Error", "Silakan ambil atau pilih foto tanaman")
      return
    }
    if (!namaTanaman.trim()) {
      Alert.alert("Error", "Nama tanaman wajib diisi")
      return
    }
    if (!statusTanaman) {
      Alert.alert("Error", "Status tanaman wajib dipilih")
      return
    }
    if (!jarakTanam) {
      Alert.alert("Error", "Jarak tanam wajib dipilih")
      return
    }
    if (!ajir) {
      Alert.alert("Error", "Ajir wajib dipilih")
      return
    }
    if (!kebersihanPiringan) {
      Alert.alert("Error", "Kebersihan piringan wajib dipilih")
      return
    }
    if (!indikasiGagal) {
      Alert.alert("Error", "Indikasi gagal wajib dipilih")
      return
    }
    if (!estimasiTinggi) {
      Alert.alert("Error", "Estimasi tinggi wajib dipilih")
      return
    }

    const values: TanamanFormValues = {
      image: imageUri,
      imageFile: imageUri ? { uri: imageUri, type: "image/jpeg", fileName: "photo.jpg" } : null,
      nama_tanaman: namaTanaman.trim(),
      status_tanaman : statusTanaman,
      jarak_tanam: jarakTanam,
      ajir,
      kebersihan_piringan: kebersihanPiringan,
      indikasi_gagal: indikasiGagal,
      estimasi_tinggi: estimasiTinggi,
      catatan,
      latitude: location.latitude,
      longitude: location.longitude,
    }

    onSubmit(values)

    // Reset form on success
    resetForm()
  }

  const resetForm = () => {
    setNamaTanaman("")
    setStatusTanaman("")
    setJarakTanam("")
    setAjir("")
    setKebersihanPiringan("")
    setIndikasiGagal("")
    setEstimasiTinggi("")
    setCatatan("")
    setImageUri(null)
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} backgroundColor={useColor}>
      <ScrollView style={[styles.container, { backgroundColor: useColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: useColor }]}>
          <Text preset="heading" style={styles.headerTitle}>Monitoring Tanaman</Text>
          <Text style={styles.headerSubtitle}>Catat kondisi tanaman Anda</Text>
        </View>

        <View style={styles.content}>
          {/* Image Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Foto Tanaman *</Text>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setShowImageModal(true)}
                  >
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImageUri(null)}
                  >
                    <IconPack name="closeCircle" size={scale(24)} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconPack name="camera" size={scale(48)} color={colors.textDim} />
                  <Text style={styles.imagePlaceholderText}>Ambil Foto Tanaman</Text>
                </View>
              )}
            </View>
            <View style={styles.imageButtonsRow}>
              <Button
                text="Kamera"
                preset="default"
                size="small"
                color="primary"
                onPress={handleOpenCamera}
                LeftAccessory={() => <IconPack name="camera" size={scale(16)} color="white" />}
                style={styles.imageButton}
              />
              <Button
                text="Galeri"
                preset="default"
                size="small"
                color="info"
                onPress={handlePickImage}
                LeftAccessory={() => <IconPack name="image" size={scale(16)} color="white" />}
                style={styles.imageButton}
              />
            </View>
          </View>

          {/* Nama Tanaman */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nama Tanaman *</Text>
            <View style={[styles.inputContainer, { borderColor: colors.separator }]}>
              <IconPack name="tree" size={scale(18)} color={colors.textDim} />
              <RNTextInput
                style={styles.input}
                placeholder="Masukkan nama tanaman"
                placeholderTextColor={colors.textDim}
                value={namaTanaman}
                onChangeText={setNamaTanaman}
              />
            </View>
          </View>

          {/* Status Tanaman - Dropdown */}
          <View style={styles.section}>
            <Dropdown
              label="Status Tanaman *"
              placeholder="Pilih status tanaman"
              options={STATUS_OPTIONS}
              value={statusTanaman}
              onSelect={(value) => setStatusTanaman(value as string)}
              size="medium"
            />
          </View>

          {/* Detail Perawatan - All Required */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Detail Perawatan *</Text>

            {/* Jarak Tanam */}
            <Dropdown
              label="Jarak Tanam *"
              placeholder="Pilih jarak tanam"
              options={JARAK_TANAM_OPTIONS}
              value={jarakTanam}
              onSelect={(value) => setJarakTanam(value as string)}
              size="medium"
            />

            {/* Ajir */}
            <Dropdown
              label="Ajir *"
              placeholder="Pilih ajir"
              options={AJIR_OPTIONS}
              value={ajir}
              onSelect={(value) => setAjir(value as string)}
              size="medium"
            />

            {/* Kebersihan Piringan */}
            <Dropdown
              label="Kebersihan Piringan *"
              placeholder="Pilih kebersihan"
              options={KEBERSIHAN_OPTIONS}
              value={kebersihanPiringan}
              onSelect={(value) => setKebersihanPiringan(value as string)}
              size="medium"
            />

            {/* Indikasi Gagal */}
            <Dropdown
              label="Indikasi Gagal *"
              placeholder="Pilih indikasi"
              options={INDIKASI_GAGAL_OPTIONS}
              value={indikasiGagal}
              onSelect={(value) => setIndikasiGagal(value as string)}
              size="medium"
            />

            {/* Estimasi Tinggi */}
            <Dropdown
              label="Estimasi Tinggi *"
              placeholder="Pilih estimasi tinggi"
              options={ESTIMASI_TINGGI_OPTIONS}
              value={estimasiTinggi}
              onSelect={(value) => setEstimasiTinggi(value as string)}
              size="medium"
            />
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.locationHeader}>
              <Text style={styles.sectionLabel}>Lokasi *</Text>
              <TouchableOpacity
                style={[styles.getLocationButton, { backgroundColor: colors.tint }]}
                onPress={handleGetLocation}
              >
                <IconPack name="map" size={scale(16)} color="white" />
                <Text style={styles.getLocationButtonText}>Get Lokasi</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <IconPack name="global" size={scale(18)} color={colors.textDim} />
                <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
              </View>
              <View style={styles.locationItem}>
                <IconPack name="global" size={scale(18)} color={colors.textDim} />
                <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
              </View>
            </View>
          </View>

          {/* Catatan */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Catatan</Text>
            <View style={[styles.textAreaContainer, { borderColor: colors.separator }]}>
              <TextField
                style={styles.textArea}
                placeholder="Tambahkan catatan tentang tanaman..."
                placeholderTextColor={colors.textDim}
                value={catatan}
                onChangeText={setCatatan}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Button
              text={isLoading ? "Menyimpan..." : "Simpan Data"}
              preset="default"
              size="large"
              color="primary"
              rounded="full"
              onPress={handleSubmit}
              disabled={isLoading || !imageUri}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Full Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          />
          <View style={styles.modalContent}>
            <Image source={{ uri: imageUri || "" }} style={styles.fullImage} resizeMode="contain" />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowImageModal(false)}
            >
              <IconPack name="closeCircle" size={scale(32)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  )
}

export default PenanamanContainerView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: scale(16),
  },
  headerTitle: {
    fontSize: scaleFontSize(24),
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: scaleFontSize(14),
    color: "rgba(255,255,255,0.8)",
  },
  section: {

    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  sectionLabel: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    marginBottom: scale(12),
  },
  // Image styles
  imageContainer: {
    marginBottom: scale(12),
  },
  imagePreviewContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  imagePreview: {
    width: Dimensions.get('screen').width * 0.92,
    height: Dimensions.get('screen').height * 0.60,
    borderRadius: scale(12),
  },
  removeImageButton: {
    position: "absolute",
    top: scale(-8),
    right: scale(-8),
    backgroundColor: "#fff",
    borderRadius: scale(12),
  },
  imagePlaceholder: {
    width: "100%",
    height: scale(150),
    backgroundColor: "#f5f5f5",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: scale(8),
    fontSize: scaleFontSize(14),
    color: "#999",
  },
  imageButtonsRow: {
    flexDirection: "row",
    gap: scale(12),
  },
  imageButton: {
    flex: 1,
  },
  // Status card
  row: {
    flexDirection: "row",
    gap: scale(12),
  },
  statusCard: {
    borderWidth: 2,
    borderRadius: scale(12),
    padding: scale(16),
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  statusText: {
    marginTop: scale(8),
    fontSize: scaleFontSize(14),
    fontWeight: "600",
  },
  // Input styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    gap: scale(10),
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: scaleFontSize(14),
    color: "#333",
  },
  // Location
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(12),
  },
  getLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
  },
  getLocationButtonText: {
    fontSize: scaleFontSize(12),
    fontWeight: "600",
    color: "#fff",
  },
  locationContainer: {
    gap: scale(8),
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  locationText: {
    fontSize: scaleFontSize(13),
  },
  // Text area
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(12),
  },
  defaultTextInput: {
    fontSize: scaleFontSize(14),
    color: "#333",
  },
  textArea: {
    flex: 1,
    minHeight: scale(80),
  },
  // Submit
  submitSection: {
    padding: scale(16),
  },
  submitButton: {
    width: "100%",
  },
  bottomSpacer: {
    height: scale(40),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
  },
  closeModalButton: {
    position: "absolute",
    top: scale(50),
    right: scale(20),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: scale(20),
    padding: scale(8),
  },
})

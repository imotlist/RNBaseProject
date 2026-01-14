// ============================================================================
// Styles
// ============================================================================

import { scale, scaleFontSize } from "@/utils/responsive";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
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

/**
 * Penanaman.tsx
 *
 * Container-based screen for Penanaman feature.
 * This file contains the screen controller logic with state management
 * and event handlers.
 *
 * @module screens/Penanaman
 */

import { useCallback, useState } from "react"
import { useIsFocused } from "@react-navigation/native"
import { useAppTheme } from "@/theme/context"
import PenanamanScreenView from "./PenanamanScreenView"
import * as penanamanApi from "@/services/api/apisCollection/penanaman"
import { useCachedLocation } from "@/hooks/useLocation"

// ============================================================================
// Types
// ============================================================================

export interface TanamanFormValues {
  image: string | null
  imageFile: any | null
  nama_tanaman: string
  status_tanaman: string
  jarak_tanam: string
  ajir: string
  kebersihan_piringan: string
  indikasi_gagal: string
  estimasi_tinggi: string
  catatan: string
  latitude: string
  longitude: string
}

export interface PenanamanScreenViewProps {
  isLoading: boolean
  statusBarColor: string
  isFocused: boolean
  initialLocation?: { latitude: string; longitude: string }
  onSubmit: (values: TanamanFormValues) => Promise<void>
  onGetLocation: () => Promise<{ latitude: string; longitude: string } | null>
}

// ============================================================================
// Screen Component
// ============================================================================

const Penanaman = () => {
  const { theme: { colors } } = useAppTheme()
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)
  const { cachedLocation } = useCachedLocation()

  const statusBarColor = colors.palette.primary700

  // Get location callback
  const handleGetLocation = useCallback(async () => {
    if (cachedLocation) {
      return {
        latitude: cachedLocation.latitude.toString(),
        longitude: cachedLocation.longitude.toString(),
      }
    }
    return {
      latitude: "-6.200000",
      longitude: "106.816666",
    }
  }, [cachedLocation])

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: TanamanFormValues) => {
      setIsLoading(true)

      try {
        // Create FormData for image upload
        const formData = new FormData()

        // Append image if exists
        if (values.imageFile) {
          formData.append('image', {
            uri: values.imageFile.uri,
            type: values.imageFile.type || 'image/jpeg',
            name: values.imageFile.fileName || 'photo.jpg',
          } as any)
        }

        // Append other fields
        formData.append('nama_tanaman', values.nama_tanaman)
        formData.append('status_tanaman', values.status_tanaman)
        formData.append('jarak_tanam', values.jarak_tanam)
        formData.append('ajir', values.ajir)
        formData.append('kebersihan_piringan', values.kebersihan_piringan)
        formData.append('indikasi_gagal', values.indikasi_gagal)
        formData.append('estimasi_tinggi', values.estimasi_tinggi)
        formData.append('catatan', values.catatan)

        // Append location
        formData.append('latitude', values.latitude)
        formData.append('longitude', values.longitude)

        // Call API
        await penanamanApi.createMonitoring(formData)
      } catch (error) {
        console.error("Penanaman submit error:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const viewProps: PenanamanScreenViewProps = {
    isLoading,
    statusBarColor,
    isFocused,
    initialLocation: cachedLocation ? {
      latitude: cachedLocation.latitude.toString(),
      longitude: cachedLocation.longitude.toString(),
    } : undefined,
    onSubmit: handleSubmit,
    onGetLocation: handleGetLocation,
  }

  return <PenanamanScreenView {...viewProps} />
}

export default Penanaman

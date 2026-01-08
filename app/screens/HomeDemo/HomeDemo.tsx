/**
 * HomeDemo.tsx
 *
 * Container-based screen template for HomeDemo feature.
 * This file contains the screen controller logic with state management
 * and event handlers for container-style screens.
 *
 * @module screens/HomeDemo
 */

import { useCallback } from "react"
import HomeDemoView from "./HomeDemoView"

// ============================================================================
// Types
// ============================================================================

export interface DemoScreen {
  id: string
  name: string
  icon: string
  description: string
}

export interface HomeDemoViewProps {
  onNavigateToScreen: (screenId: string) => void
}

// ============================================================================
// Screen Component
// ============================================================================

const HomeDemo = () => {
  // Handle navigation to component showcase screens
  const handleNavigateToScreen = useCallback((screenId: string) => {
    console.log("Navigating to screen:", screenId)
    // Navigate to the appropriate screen based on ID
    // The actual navigation will be handled by the view component
  }, [])

  return <HomeDemoView onNavigateToScreen={handleNavigateToScreen} />
}

export default HomeDemo

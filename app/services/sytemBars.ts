import { Platform } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"

export async function setNavigationBar(
  color: string,
  lightIcons: boolean,
) {
  if (Platform.OS !== "android") return

  try {
    await changeNavigationBarColor(color, lightIcons)
  } catch {
    // fail silently
  }
}

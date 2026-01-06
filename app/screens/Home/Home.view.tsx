
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { View, Text } from "react-native"
import { Avatar } from "@/components/ui/Avatar"
import { useAppTheme } from "@/theme/context"
import { Frame, HeaderApp } from "@/components/ui"
import { Card } from "@/components/Card"
import { useEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native"

const HomeView = () => {
    const { theme: { colors, layout } } = useAppTheme();
    const [useColor, setColor] = useState(colors.palette.primary300);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setColor(colors.palette.primary300);
        }
    }, [useColor, isFocused]);

    return (
        <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor}>
            <HeaderApp
                avatarText="XY"
                title="Guest User"
                subtitle="Administrator"
                // notificationIcon="setting"
                notificationCount={10}
                backgroundColor={useColor}
            />
            <View style={{ height: 70, backgroundColor: 'white' }}>
                <View style={[layout.rowEvenPad, layout.gap]}>
                    <Frame color="neutral" style={{ height: 100, marginTop: 20 }}>
                        <Text>Neutral Frame (default)</Text>
                    </Frame>
                    <Frame color="danger" style={{ height: 100, marginTop: 20 }}>
                        <Text>Neutral Frame (default)</Text>
                    </Frame>
                </View>
            </View>
        </Screen>
    )
}

export default HomeView
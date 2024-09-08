import { Stack } from "expo-router/stack";
import Navigation from "./components/Navigation";
import App from "../App";
import Header from "./components/Header";
import { ScrollView } from "react-native";
import { usePathname } from "expo-router";
import { View } from "react-native";
import tw from "./util/tw";

export default function AppLayout() {
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
        >
            <App>
                {usePathname() != "/" ? <Header /> : <View />}

                <Stack
                    screenOptions={{
                        // Hide the header for this route
                        headerShown: false,
                    }}
                />

                {usePathname() != "/" ? (
                    <Navigation />
                ) : (
                    <View style={tw`bg-white h-10`} />
                )}
            </App>
        </ScrollView>
    );
}

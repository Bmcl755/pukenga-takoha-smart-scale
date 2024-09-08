import tw from "../util/tw";
import { View, Text, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator, Button, FAB, TextInput } from "react-native-paper";
import ChildCard from "../components/ChildCard";
import { useCallback, useEffect, useState } from "react";
import usePlunketApi from "../hooks/usePlunketApi";
import { Child } from "../lib/plunketApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import Loading from "../components/Loading";

export default function Main() {
  function handleNavigation() {
    router.push("/createchildrecord");
  }

  function createChildrenCards(children: Child[]) {
    return children.map((child) => <ChildCard key={child._id} child={child} />);
  }

  // Create a state to display a loading state
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // We need to grab the children from the server
  const [children, setChildren] = useState<Child[]>([]);
  const [displayedChildren, setDisplayedChildren] = useState<Child[]>([]);
  const { api } = usePlunketApi();

  const updateChildren = async () => {
    const response = await api.getChildren();

    if (response.success) {
      setChildren(response.children);
      setLoading(false);
    } else {
      alert(response.message);
      // redirect back to login on failure
      router.push("/");
    }
  };

  // Run once on component mount
  useEffect(() => {
    updateChildren();
  }, []);

  // Also update when the page has focus again
  useFocusEffect(
    useCallback(() => {
      updateChildren();
    }, [])
  );

  useEffect(() => {
    setDisplayedChildren(
      children.filter((child) => {
        return (
          child.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.first_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [searchTerm, children]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={tw`bg-white h-screen w-screen p-4`}>
      <Text style={tw`text-2xl text-main mb-6`}>Your Assigned Children</Text>
      <TextInput
        mode="outlined"
        style={tw`w-full mb-6`}
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        label="Search by name"
      />
      <View style={tw`flex-col justify-center items-center h-[68%]`}>
        {displayedChildren.length > 0 ? (
          <ScrollView style={tw`h-full w-full`}>
            {createChildrenCards(displayedChildren)}
          </ScrollView>
        ) : searchTerm ? (
          <View style={tw`flex-1 justify-center items-center`}>
            {/* Display a warning icon */}
            <Ionicons name="warning" size={32} color="black" />
            <Text>No children matching search found</Text>
          </View>
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <Ionicons name="warning" size={32} color="black" />
            <Text>No children assigned</Text>
          </View>
        )}

        <FAB
          icon="plus"
          label="New Child"
          style={tw`absolute right-0 bottom-0`}
          onPress={() => handleNavigation()}
        />
      </View>
    </View>
  );
}

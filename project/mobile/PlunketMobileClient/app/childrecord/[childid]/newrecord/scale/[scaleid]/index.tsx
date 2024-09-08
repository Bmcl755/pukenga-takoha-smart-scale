import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import tw from "../../../../../util/tw";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import WeightCard from "../../../../../components/WeightCard";
import { useCallback, useEffect, useState } from "react";
import { Child, ScaleData } from "../../../../../lib/plunketApi";
import usePlunketApi from "../../../../../hooks/usePlunketApi";
import Loading from "../../../../../components/Loading";

export default function ScaleRecord() {
  function createReading() {
    router.push("#");
  }

  function createWeightCards() {
    const weighings = scaleData.weighings;

    weighings.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    weighings.length = 3;

    return weighings.map((weighing) => {
      return (
        <Pressable
          onPress={() => {
            sendReading(weighing.weight);
          }}
        >
          <WeightCard key={weighing._id} weighing={weighing} />
        </Pressable>
      );
    });
  }

  // Get the scale and child ID from the URL
  const { childid, scaleid } = useLocalSearchParams<{
    childid: string;
    scaleid: string;
  }>();

  const { api } = usePlunketApi();

  const [loadingScale, setLoadingScale] = useState<boolean>(true);
  const [loadingChild, setLoadingChild] = useState<boolean>(true);
  const [scaleData, setScaleData] = useState<ScaleData | null>(null);
  const [child, setChild] = useState<Child | null>(null);

  async function sendReading(value: number) {
    setLoadingChild(true);
    const response = await api.createWeighing(childid, value);

    if (response.success) {
      router.navigate(`/childrecord/${childid}`);
      alert("Record created successfully");
    } else {
      alert(response.message);
      setLoadingChild(false);
    }
  }

  async function updateScaleData(interval = false) {
    setLoadingScale(true);
    const response = await api.getScaleData(scaleid);

    if (response.success) {
      setScaleData(response.scale);
      setLoadingScale(false);
    } else {
      if (interval) return;
      alert(response.message);
      router.back();
    }
  }

  const updateChildRecord = async () => {
    const response = await api.getChild(childid);

    if (response.success) {
      setChild(response.children[0]);
      setLoadingChild(false);
    } else {
      alert(response.message);
      router.push("/");
    }
  };

  // Update the scale data on mount
  useEffect(() => {
    updateChildRecord();
    updateScaleData();
  }, [scaleid, childid]);

  // Update every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateScaleData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [scaleid, childid]);

  // Update when the screen is focused again
  useFocusEffect(
    useCallback(() => {
      updateChildRecord();
      updateScaleData();
    }, [scaleid, childid])
  );

  if (loadingScale || loadingChild) {
    return <Loading />;
  }

  return (
    <View style={tw`bg-white h-screen w-screen p-4`}>
      <Text style={tw`text-3xl text-main pr-4`}>
        Create new record for {child.first_name} {child.last_name.toUpperCase()}
      </Text>
      <Text style={tw`text-xl text-main my-4`}>
        Scale: {scaleData.physical_id}
      </Text>
      <View style={tw`flex flex-col h-full w-full`}>
        <ScrollView style={tw`flex-grow`}>
          {scaleData.weighings.length > 0 ? (
            createWeightCards()
          ) : (
            <Text style={tw`text-main text-xl`}>No scale data yet</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

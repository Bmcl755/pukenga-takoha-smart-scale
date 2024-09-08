import { router, useLocalSearchParams } from "expo-router";
import tw from "../../../util/tw";
import { View, Text } from "react-native";
import {
  Button,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { useEffect, useState } from "react";
import usePlunketApi from "../../../hooks/usePlunketApi";
import { Child } from "../../../lib/plunketApi";
import Loading from "../../../components/Loading";

export default function NewRecord() {
  const { api } = usePlunketApi();
  const [useScale, setUseScale] = useState(true);

  const { childid } = useLocalSearchParams<{
    childid: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [child, setChild] = useState<Child>(null);
  const [scaleId, setScaleId] = useState<string>("");
  const [manualReading, setManualReading] = useState<string>("");

  const onToggleSwitch = () => setUseScale(!useScale);

  function createScaleReading() {
    router.navigate(`/childrecord/${childid}/newrecord/scale/${scaleId}`);
  }

  async function createManualReading() {
    setLoading(true);
    const manualReadingNumber = parseFloat(manualReading);
    const response = await api.createWeighing(childid, manualReadingNumber);

    if (response.success) {
      router.navigate(`/childrecord/${childid}`);
      alert("Record created successfully");
    } else {
      alert(response.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const response = await api.getChild(childid);

      if (response.success) {
        setChild(response.children[0]);
        setLoading(false);
      } else {
        alert(response.message);
        router.push("/");
      }
    })();
  }, []);

  // function toUseScale() {
  //     router.push("/childrecord/newrecord/scale");
  // }

  // function toUseManual() {
  //     router.push("/childrecord/newrecord/manual");
  // }

  // display loading screen
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <View style={tw`bg-white flex flex-col p-4`}>
        <View>
          <Text style={tw`text-3xl text-main pr-4`}>
            Create new record for {child.first_name}{" "}
            {child.last_name.toUpperCase()}
          </Text>
        </View>
        <View style={tw`flex flex-row items-center`}>
          <Text style={tw`text-lg text-main pb-1`}>Use Scale</Text>
          <Switch
            style={tw``}
            value={useScale}
            onValueChange={onToggleSwitch}
          />
        </View>
      </View>
      {useScale ? (
        <View style={tw`bg-white h-screen w-screen p-4`}>
          <Text style={tw`text-xl text-main my-4`}>Scale:</Text>
          <TextInput
            style={tw`w-full mb-10`}
            mode="outlined"
            label="Scale Physical ID"
            value={scaleId}
            onChangeText={(text) => setScaleId(text)}
          />
          <Button
            style={tw`w-full py-1 rounded-lg mt-4`}
            loading={false}
            disabled={false}
            mode="contained"
            onPress={() => createScaleReading()}
          >
            Next
          </Button>
        </View>
      ) : (
        <View style={tw`bg-white h-screen w-screen p-4`}>
          <Text style={tw`text-xl text-main my-4`}>Enter Reading:</Text>
          <TextInput
            style={tw`w-full mb-10 `}
            mode="outlined"
            label="Scale Reading"
            keyboardType="numeric"
            value={manualReading}
            onChangeText={(text) => setManualReading(text)}
          />
          <Button
            style={tw`w-full py-1 rounded-lg mt-4`}
            loading={false}
            disabled={false}
            mode="contained"
            onPress={() => createManualReading()}
          >
            Save
          </Button>
        </View>
      )}
    </>
  );
}

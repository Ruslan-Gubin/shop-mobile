import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchForwardAction, type GeocodeResult } from "../../../../shared/helpers/geocode";
import { PinAddressSvg } from "../../../../shared/svg/PinAddressSvg";
import { FieldInput } from "../../../../shared/ui/FieldInput/FieldInput";

type Props = {
  onSelectCourier: (payload: GeocodeResult) => void;
};

type SuggestionItem = {
  name: string;
  place: string;
};

export const AddressSearch = ({ onSelectCourier }: Props) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSearchAddress = async (value: string): Promise<SuggestionItem[]> => {
    const apiKey = "0ebe3f4b-328f-4791-9382-746493053198";

    return fetch(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&types=geo&text=${encodeURIComponent(value)}&lang=ru_RU&results=10&print_address=1`,
    )
      .then((response) => response.json())
      .then((response: { results?: SuggestionItem[] | undefined }) => {
        return (response.results || []).map((r) => ({
          name: r.name,
          place: r.place,
        }));
      });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChangeSearch = (value: string) => {
    setSearch(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (value.trim()) {
      timerRef.current = setTimeout(() => {
        fetchSearchAddress(value)
          .then((items) => setSuggestions(items))
          .catch(() => setSuggestions([]));
      }, 400);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    const address = `${item.place}, ${item.name}`;

    fetchForwardAction(address)
      .then((payload) => {
        setSearch(payload.place === payload.name ? payload.name : `${payload.place}, ${payload.name}`);
        onSelectCourier(payload);
      })
      .finally(() => {
        setSuggestions([]);
      });
  };

  return (
    <View style={styles.root}>
      <FieldInput
        value={search}
        onChangeText={handleChangeSearch}
        placeholder="Искать на карте"
      />
      {suggestions.length > 0 && (
        <View style={styles.searchList}>
          {suggestions.map((item) => (
            <Pressable
              key={`${item.name}_${item.place}`}
              style={styles.searchItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <PinAddressSvg size={28} />
              <View style={styles.searchItemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                  {item.place}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 4,
    zIndex: 2,
  },
  searchList: {
    borderWidth: 1,
    borderColor: "#f1f1f5",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 4,
    rowGap: 2,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    padding: 6,
    borderRadius: 8,
  },
  searchItemInfo: {
    flex: 1,
    rowGap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#8a8999",
  },
});
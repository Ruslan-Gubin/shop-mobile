import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CONFIG_APP } from "../../../shared/config/config";
import { fetchForwardAction, type GeocodeResult } from "../../../shared/helpers/geocode";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { PinAddressSvg } from "../../../shared/svg/PinAddressSvg";
import { SearchSvg } from "../../../shared/svg/SearchSvg";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (payload: GeocodeResult) => void;
  search: string;
  onChangeSearch: (value: string) => void;
};

type SuggestionItem = {
  name: string;
  place: string;
};

type GeocodeFeature = {
  properties?: {
    name?: string;
    place_formatted?: string;
    full_address?: string;
    context?: {
      place?: { name?: string };
      region?: { name?: string };
      country?: { name?: string };
    };
  };
};

type GeocodeResponse = {
  features?: GeocodeFeature[];
};

export const AddressSearchModal = ({
  visible,
  onClose,
  onSelect,
  search,
  onChangeSearch,
}: Props) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const debounceFn = useDebounce();

  const fetchHousesMapbox = async (streetAddress: string): Promise<SuggestionItem[]> => {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(streetAddress)}&language=ru&limit=10&types=address&access_token=${CONFIG_APP.MAPBOX_ACCESS_TOKEN}`,
    );
    const data: GeocodeResponse = await response.json();

    return (data.features || []).map((item) => {
      const props = item.properties || {};
      return {
        name: props.full_address || props.name || "",
        place:
          props.place_formatted || props.context?.place?.name || props.context?.region?.name || "",
      };
    });
  };

  const handleChangeSearch = (value: string) => {
    onChangeSearch(value);

    if (value.trim().length > 3) {
      debounceFn(() => {
        fetchHousesMapbox(value)
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
        onSelect(payload);
        onClose();
      })
      .catch(() => undefined)
      .finally(() => {
        setSuggestions([]);
      });
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Поиск адреса">
      <View style={styles.searchSection}>
        <View style={styles.inputContainer}>
          <SearchSvg size={18} fill="gray" />
          <TextInput
            value={search}
            onChangeText={handleChangeSearch}
            style={styles.input}
            placeholder="Найти адрес"
            placeholderTextColor="#b3b3b3"
            autoFocus
          />
        </View>

        <ScrollView style={styles.suggestionsList}>
          {suggestions.map((item) => (
            <Pressable
              key={`${item.name}_${item.place}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <PinAddressSvg size={24} />
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.suggestionPlace} numberOfLines={1}>
                  {item.place}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {search.length === 0 && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Введите адрес для поиска</Text>
          </View>
        )}
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    minHeight: 260,
    maxHeight: 570,
    rowGap: 8,
  },
  inputContainer: {
    backgroundColor: "#f1f1f5",
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 6,
    paddingInline: 8,
    columnGap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#171717",
  },
  suggestionsList: {
    rowGap: 2,
    maxHeight: 510,
    minHeight: 510,
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f5",
  },
  suggestionInfo: {
    flex: 1,
    rowGap: 2,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  suggestionPlace: {
    fontSize: 12,
    color: "#8a8999",
  },
  hintContainer: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    fontSize: 14,
    color: "#8a8999",
  },
});

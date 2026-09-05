import { ScrollView, StyleSheet, View } from "react-native";
import type { CatalogFilter, CatalogFiltersResponse } from "../../types";
import { DropdownFilterCountry, DropdownFilterMultiSelect, DropdownFilterSelect } from "./dropdown";

type Props = {
  filters: CatalogFilter;
  filtersData: CatalogFiltersResponse;
  setFilters: React.Dispatch<React.SetStateAction<CatalogFilter>>;
};

export const FilterBar = (props: Props) => {
  const SORT_OPTIONS = [
    { value: "popular", label: "По популярности" },
    { value: "rate", label: "По рейтингу" },
    { value: "price_up", label: "По возрастанию цены" },
    { value: "price_down", label: "По убыванию цены" },
    { value: "new", label: "По новинкам" },
  ];

  const handleChangeSort = (sort: string) => props.setFilters((prev) => ({ ...prev, sort }));

  const handleChangeCountry = (country: string[]) =>
    props.setFilters((prev) => ({ ...prev, country }));

  const handleResetCountry = () => {
    props.setFilters((prev) => ({ ...prev, country: [] }));
  };

  const handleChangeProductTypes = (product_types: string[]) =>
    props.setFilters((prev) => ({ ...prev, product_types }));

  const handleResetProductTypes = () => {
    props.setFilters((prev) => ({ ...prev, product_types: [] }));
  };

  const handleSelectSpecification = (id: number, values: string[]) => {
    props.setFilters((prev) => {
      const prevSpecifications = prev.specifications.find((el) => el.id === id);

      if (!prevSpecifications) {
        prev.specifications.push({ id, values });
      } else {
        prevSpecifications.values = values;
      }

      return { ...prev };
    });
  };

  // const minPrice = props.filters?.price?.min || 1;
  // const maxPrice = props.filters?.price?.max || 100000;
  //
  // const priceActive = props.state.priceFrom !== "" || props.state.priceTo !== "";

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <DropdownFilterSelect
          value={props.filters.sort || "popular"}
          onChange={handleChangeSort}
          options={SORT_OPTIONS}
          title="Сортировка"
          label={SORT_OPTIONS.find((el) => el.value === props.filters.sort)?.label || "Сортировка"}
        />

        {/* <DropdownFilterPrice */}
        {/*   minPrice={minPrice} */}
        {/*   maxPrice={maxPrice} */}
        {/*   value={{ from: props.state.priceFrom, to: props.state.priceTo }} */}
        {/*   onChange={props.onPriceChange} */}
        {/*   onReset={props.onPriceReset} */}
        {/*   active={priceActive} */}
        {/* /> */}

        {props.filtersData.specifications.map((specification) => (
          <DropdownFilterMultiSelect
            key={specification.id}
            title={specification.name}
            values={specification.values}
            selected={
              props.filters.specifications.find((el) => el.id === specification.id)?.values || []
            }
            onChange={(selected) => handleSelectSpecification(specification.id, selected)}
            onReset={() => handleSelectSpecification(specification.id, [])}
          />
        ))}

        {props.filtersData.countries && props.filtersData.countries.length > 1 && (
          <DropdownFilterCountry
            title="Производитель"
            options={props.filtersData.countries}
            selected={props.filters.country}
            onChange={handleChangeCountry}
            onReset={handleResetCountry}
          />
        )}

        {props.filtersData.product_types && props.filtersData.product_types.length > 1 && (
          <DropdownFilterCountry
            title="Вид товара"
            options={props.filtersData.product_types}
            selected={props.filters.product_types}
            onChange={handleChangeProductTypes}
            onReset={handleResetProductTypes}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 12,
    columnGap: 8,
    alignItems: "center",
  },
});

import { ScrollView, StyleSheet, View } from "react-native";
import type { CatalogFilter, CatalogFiltersResponse } from "../../types";
import { DropdownFilterSelect } from "./dropdown";

type Props = {
  filters: CatalogFilter;
  filtersData: CatalogFiltersResponse;
  setFilters: React.Dispatch<React.SetStateAction<CatalogFilter>>;
};

export const FilterBar = (props: Props) => {
  // const minPrice = props.filters?.price?.min || 1;
  // const maxPrice = props.filters?.price?.max || 100000;
  //
  // const priceActive = props.state.priceFrom !== "" || props.state.priceTo !== "";
  const SORT_OPTIONS = [
    { value: "popular", label: "По популярности" },
    { value: "rate", label: "По рейтингу" },
    { value: "price_up", label: "По возрастанию цены" },
    { value: "price_down", label: "По убыванию цены" },
    { value: "new", label: "По новинкам" },
  ];

  const handleChangeSort = (sort: string) => props.setFilters((prev) => ({ ...prev, sort }));

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

        {/* {props.filters?.specifications.map((specification) => { */}
        {/*   const selected = props.state.specifications.filter((el) => */}
        {/*     el.startsWith(`${specification.id}:`), */}
        {/*   ); */}
        {/*   return ( */}
        {/*     <DropdownFilterMultiSelect */}
        {/*       key={specification.id} */}
        {/*       title={specification.name} */}
        {/*       values={specification.values} */}
        {/*       selected={selected} */}
        {/*       onChange={(key) => props.onSpecificationToggle(`${specification.id}:${key}`)} */}
        {/*       onReset={() => */}
        {/*         props.onSpecificationReset( */}
        {/*           specification.values.map((value) => `${specification.id}:${value}`), */}
        {/*         ) */}
        {/*       } */}
        {/*     /> */}
        {/*   ); */}
        {/* })} */}

        {/* {props.filters?.countries && props.filters.countries.length > 0 && ( */}
        {/*   <DropdownFilterCountry */}
        {/*     title="Производитель" */}
        {/*     options={props.filters.countries} */}
        {/*     selected={props.state.country} */}
        {/*     onChange={props.onCountryToggle} */}
        {/*     onReset={props.onCountryReset} */}
        {/*   /> */}
        {/* )} */}

        {/* {props.filters?.product_types && props.filters.product_types.length > 0 && ( */}
        {/*   <DropdownFilterCountry */}
        {/*     title="Вид товара" */}
        {/*     options={props.filters.product_types} */}
        {/*     selected={props.state.productTypes} */}
        {/*     onChange={props.onProductTypeToggle} */}
        {/*     onReset={props.onProductTypeReset} */}
        {/*   /> */}
        {/* )} */}
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

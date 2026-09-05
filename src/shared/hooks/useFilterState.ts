import { useCallback, useState } from "react";
import type { CatalogFilterState } from "../../screen/Catalog/types";

const INITIAL_STATE: CatalogFilterState = {
  sort: "popular",
  priceFrom: "",
  priceTo: "",
  specifications: [],
  country: [],
  productTypes: [],
};

//TODO REMOVE
export const useFilterState = () => {
  const [filterState, setFilterState] = useState<CatalogFilterState>(INITIAL_STATE);

  const handleSortChange = useCallback((value: string) => {
    setFilterState((prev) => ({ ...prev, sort: value }));
  }, []);

  const handlePriceChange = useCallback((value: { from: string; to: string }) => {
    setFilterState((prev) => ({ ...prev, priceFrom: value.from, priceTo: value.to }));
  }, []);

  const handlePriceReset = useCallback(() => {
    setFilterState((prev) => ({ ...prev, priceFrom: "", priceTo: "" }));
  }, []);

  const handleSpecificationToggle = useCallback((key: string) => {
    setFilterState((prev) => {
      const current = prev.specifications.includes(key)
        ? prev.specifications.filter((el) => el !== key)
        : [...prev.specifications, key];
      return { ...prev, specifications: current };
    });
  }, []);

  const handleSpecificationReset = useCallback((values: string[]) => {
    setFilterState((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((el) => !values.includes(el)),
    }));
  }, []);

  const handleCountryToggle = useCallback((value: string) => {
    setFilterState((prev) => {
      const current = prev.country.includes(value)
        ? prev.country.filter((el) => el !== value)
        : [...prev.country, value];
      return { ...prev, country: current };
    });
  }, []);

  const handleCountryReset = useCallback(() => {
    setFilterState((prev) => ({ ...prev, country: [] }));
  }, []);

  const handleProductTypeToggle = useCallback((value: string) => {
    setFilterState((prev) => {
      const current = prev.productTypes.includes(value)
        ? prev.productTypes.filter((el) => el !== value)
        : [...prev.productTypes, value];
      return { ...prev, productTypes: current };
    });
  }, []);

  const handleProductTypeReset = useCallback(() => {
    setFilterState((prev) => ({ ...prev, productTypes: [] }));
  }, []);

  const resetAll = useCallback(() => {
    setFilterState(INITIAL_STATE);
  }, []);

  return {
    filterState,
    handlers: {
      onSortChange: handleSortChange,
      onPriceChange: handlePriceChange,
      onPriceReset: handlePriceReset,
      onSpecificationToggle: handleSpecificationToggle,
      onSpecificationReset: handleSpecificationReset,
      onCountryToggle: handleCountryToggle,
      onCountryReset: handleCountryReset,
      onProductTypeToggle: handleProductTypeToggle,
      onProductTypeReset: handleProductTypeReset,
    },
    resetAll,
  };
};

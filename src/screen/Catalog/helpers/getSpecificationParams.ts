export const getSpecificationParams = (specifications: { id: number; values: string[] }[]) => {
  const updateSpecificationsParams = [];

  for (let i = 0; i < specifications.length; i++) {
    const specification = specifications[i];

    if (specification?.values?.length > 0) {
      for (let j = 0; j < specification.values.length; j++) {
        updateSpecificationsParams.push(`${specification.id}:${specification.values[j]}`);
      }
    }
  }
  return updateSpecificationsParams;
};

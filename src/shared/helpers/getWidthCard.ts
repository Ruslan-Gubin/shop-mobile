export const getWidthCard = (
  screenWidth: number,
  paddingHorizontal: number,
  gap: number,
  showRowElement: number,
) => (screenWidth - paddingHorizontal - gap * (showRowElement - 1)) / showRowElement;

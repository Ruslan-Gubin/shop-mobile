import { useEffect, useEffectEvent, useRef, useState, useTransition } from "react";

type Props<T> = {
  limit: number;
  fetchData: (page: number) => Promise<{ data: T[]; total: number }>;
};

export const useInfiniteScroll = <T extends { id: number }>(props: Props<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, transition] = useTransition();
  const busyRef = useRef(false);

  const updateInitDataEvent = useEffectEvent(() => {
    if (page === 0 && total === 0 && data.length === 0 && !loading) {
      transition(() => {
        props.fetchData(1).then((response) => {
          if (response.data.length > 0) {
            setData(response.data);
            if (response.total > 0 && total !== response.total) {
              setTotal(response.total);
            }
            setPage(1);
          }
        });
      });
    }
  });

  useEffect(() => {
    updateInitDataEvent();
  }, []);

  const isHasMore = data.length === page * props.limit && data.length < total;

  const loadMore = () => {
    if (
      !busyRef.current &&
      !loading &&
      total > 0 &&
      data.length > 0 &&
      data.length < total &&
      isHasMore
    ) {
      busyRef.current = true;

      transition(async () => {
        await props
          .fetchData(page + 1)
          .then((response) => {
            if (response.data.length > 0) {
              setData(response.data);
              const updateData = [...data];

              for (let i = 0; i < response.data.length; i++) {
                if (updateData.findIndex((el) => el.id === response?.data?.[i].id) === -1) {
                  updateData.push(response.data[i]);
                }
              }

              setData(updateData);
              setPage(page + 1);

              if (response.total > 0 && total !== response.total) {
                setTotal(response.total);
              }
            }
          })
          .finally(() => {
            busyRef.current = false;
          });
      });
    }
  };

  const resetData = () => {
    setData([]);
    setPage(0);
    setTotal(0);
  };

  const reload = () => {
    if (data.length === 0) {
      updateInitDataEvent();
    } else {
      loadMore();
    }
  };

  return { data, isHasMore, loadMore, resetData, loading, reload };
};

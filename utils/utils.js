import { useRef, useEffect } from "react";

export function getSectionListData(data) {
  let restructured = [];
  data.map(item => {
    let obj = restructured.find(
      x =>
        x.name == item.category.charAt(0).toUpperCase() + item.category.slice(1)
    );
    if (obj) {
      restructured[restructured.indexOf(obj)].data.push({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
      });
    } else {
      restructured.push({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        data: [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
          },
        ],
      });
    }
  });
  return restructured;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

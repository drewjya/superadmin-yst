export const useSidebar = () => {
  const route = useRoute();

  const current = computed(() => route.path);

  const pages = computed(() => [
    {
      title: "Orders",
      link: "/order",
    },
    {
      title: "Cabangs",
      link: "/cabangs",
    },
    {
      title: "Treatments",
      link: "/treatments",
    },
    {
      title: "Therapists",
      link: "/therapists",
    },
    {
      title: "Analytics",
      link: "/analytics",
    },
    {
      title: "Customers",
      link: "/customers",
    },
  ]);

  return {
    pages,
    current,
  };
};

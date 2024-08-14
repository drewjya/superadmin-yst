export const useSidebar = () => {
  const notif = ref<number | undefined>(6);
  const route = useRoute();

  const current = computed(() => route.path);

  const title = computed(
    () => pages.value.find((e) => current.value == e.link)?.title
  );
  const pages = computed(() => [
    {
      title: "Orders",
      link: "/order",
      notif: notif.value,
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
    title,
  };
};

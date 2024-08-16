export const useSidebar = () => {
  const route = useRoute();

  const current = computed(() => route.path);

  const pages = computed(() => [
    {
      title: "Dashboard",
      link: "/",
    },
    {
      title: "Orders",
      link: "/order",
    },
    {
      title: "Cabangs",
      link: "/cabang",
    },
    {
      title: "Treatments",
      link: "/treatment",
    },
    {
      title: "Therapists",
      link: "/therapist",
    },
    {
      title: "Analytics",
      link: "/analytic",
    },
    {
      title: "Customers",
      link: "/customer",
    },
  ]);

  return {
    pages,
    current,
  };
};

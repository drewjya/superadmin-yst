export const useSidebar = () => {

  const notif = ref<number | undefined>(6);
  
  

  const pages = computed(()=>[
    {
      title: "Dashboards",
      link: "/",
    },
    {
      title: "Orders",
      link: "/order",
      notif: notif.value,
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
      link: "/analytics",
    },
    {
      title: "Customers",
      link: "/customers",
    },
  ]);

  return {
    pages,
  };
};

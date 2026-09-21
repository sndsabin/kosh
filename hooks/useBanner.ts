import { useEffect, useState } from "react";
import { isBannerEnabled, toggleBanner as toggleBannerSavedInStorage } from "@/lib/storage";

const useBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    isBannerEnabled().then((val) => {
      setIsVisible(val);
    });
  }, []);

  const toggleBanner = () => {
    toggleBannerSavedInStorage();
    setIsVisible((prev) => !prev);
  };

  return {
    showBanner: isVisible,
    toggleBanner: toggleBanner,
  };
};

export default useBanner;

import { useState, useEffect, Dispatch, SetStateAction } from "react";

// next-themes
import { useTheme } from "next-themes";
// services
import userService from "services/user.service";
// hooks
import useUser from "hooks/use-user";
// ui
import { CustomSelect } from "components/ui";
// helpers
import { unsetCustomCssVariables } from "helpers/theme.helper";
// types
import { ICustomTheme } from "types";
// constants
import { THEMES_OBJ } from "constants/themes";

type Props = {
  setPreLoadedData: Dispatch<SetStateAction<ICustomTheme | null>>;
};

export const ThemeSwitch: React.FC<Props> = ({ setPreLoadedData }) => {
  const [mounted, setMounted] = useState(false);

  const { theme } = useTheme();

  const { user, mutateUser } = useUser();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    if (!user) return;

    mutateUser((prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        theme: {
          ...prevData.theme,
          theme: newTheme,
        },
      };
    }, false);

    userService.updateUser({
      theme: {
        ...user.theme,
        theme: newTheme,
      },
    });
  };

  if (!mounted) return null;

  const currentThemeObj = THEMES_OBJ.find((t) => t.value === theme);

  return (
    <CustomSelect
      value={theme}
      label={
        currentThemeObj ? (
          <div className="flex items-center gap-2">
            <div
              className="border-1 relative flex h-4 w-4 rotate-45 transform items-center justify-center rounded-full border"
              style={{
                borderColor: currentThemeObj.icon.border,
              }}
            >
              <div
                className="h-full w-1/2 rounded-l-full"
                style={{
                  background: currentThemeObj.icon.color1,
                }}
              />
              <div
                className="h-full w-1/2 rounded-r-full border-l"
                style={{
                  borderLeftColor: currentThemeObj.icon.border,
                  background: currentThemeObj.icon.color2,
                }}
              />
            </div>
            {currentThemeObj.label}
          </div>
        ) : (
          "System Preference"
        )
      }
      onChange={({ value, type }: { value: string; type: string }) => {
        if (value === "custom") {
          if (user?.theme.palette)
            setPreLoadedData({
              theme: "custom",
              background: user.theme.background !== "" ? user.theme.background : "#0d101b",
              text: user.theme.text !== "" ? user.theme.text : "#c5c5c5",
              primary: user.theme.primary !== "" ? user.theme.primary : "#3f76ff",
              sidebarBackground:
                user.theme.sidebarBackground !== "" ? user.theme.sidebarBackground : "#0d101b",
              sidebarText: user.theme.sidebarText !== "" ? user.theme.sidebarText : "#c5c5c5",
              darkPalette: false,
              palette:
                user.theme.palette !== ",,,,"
                  ? user.theme.palette
                  : "#0d101b,#c5c5c5,#3f76ff,#0d101b,#c5c5c5",
            });
        } else unsetCustomCssVariables();

        handleThemeChange(value);
        document.documentElement.style.setProperty("color-scheme", type);
      }}
      input
      width="w-full"
      position="right"
    >
      {THEMES_OBJ.map(({ value, label, type, icon }) => (
        <CustomSelect.Option key={value} value={{ value, type }}>
          <div className="flex items-center gap-2">
            <div
              className="border-1 relative flex h-4 w-4 rotate-45 transform items-center justify-center rounded-full border"
              style={{
                borderColor: icon.border,
              }}
            >
              <div
                className="h-full w-1/2 rounded-l-full"
                style={{
                  background: icon.color1,
                }}
              />
              <div
                className="h-full w-1/2 rounded-r-full border-l"
                style={{
                  borderLeftColor: icon.border,
                  background: icon.color2,
                }}
              />
            </div>
            {label}
          </div>
        </CustomSelect.Option>
      ))}
    </CustomSelect>
  );
};

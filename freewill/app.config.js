import 'dotenv/config';

export default {
  expo: {
    name: "freewill",
    slug: "freewill",
    version: "1.0.0",
    extra: {
      API_URL: process.env.EXPO_PUBLIC_LOCALHOST || "http://localhost:3000", // fallback if env var missing
    },
    orientation: "portrait",
    extra: {
      eas: {
        projectId: "9c442997-2cc0-481a-98ce-23931931b740"
      }
    },
    icon: "./assets/images/icon.png",
    scheme: "frontend",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.careerhackers.freewill",
      usesAppleSignIn: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.careerhackers.freewill",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
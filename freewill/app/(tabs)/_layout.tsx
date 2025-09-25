// app/(tabs)/_layout.tsx
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Label>Discover</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Explore</Label>
        <Icon sf="square.grid.3x3.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ai-chat">
        <Label>AI Chat</Label>
        <Icon sf="message.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
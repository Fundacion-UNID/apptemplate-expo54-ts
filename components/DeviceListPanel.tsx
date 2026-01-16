// components/DeviceListPanel.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';

type DeviceEntry = {
  resource?: {
    id?: string;
    client_id?: string;
    client_id_issued_at?: number;
    registration_client_uri?: string;
    ext_device_info?: {
      device_name?: string;
      os?: string;
      os_version?: string;
    };
  };
  meta?: {
    claims?: Record<string, any>;
  };
};

type Props = {
  providerDid: string;
  idToken: string;
  searchDevices: (providerDid: string, idToken: string) => Promise<{ thid: string }>;
  getSearchResult: (thid: string) => Promise<{ entries?: any[]; raw?: any } | null>;
  labels: {
    title: string;
    subtitle?: string;
    search: string;
    status: string;
    empty: string;
    deviceId: string;
    deviceName: string;
    deviceOs: string;
  };
};

export default function DeviceListPanel({ providerDid, idToken, searchDevices, getSearchResult, labels }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [thid, setThid] = useState<string | null>(null);
  const [devices, setDevices] = useState<DeviceEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!thid) return;
    const result = await getSearchResult(thid);
    const entries = (result?.entries || []) as DeviceEntry[];
    if (entries.length > 0) setDevices(entries);
  }, [thid, getSearchResult]);

  useEffect(() => {
    if (!thid) return;
    refresh();
    const handle = setInterval(() => {
      refresh().catch(() => undefined);
    }, 2500);
    return () => clearInterval(handle);
  }, [thid, refresh]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDevices([]);
    try {
      const { thid: newThid } = await searchDevices(providerDid, idToken);
      setThid(newThid);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [providerDid, idToken, searchDevices]);

  const deviceRows = useMemo(() => {
    return devices.map((entry, index) => {
      const resource = entry.resource || {};
      const info = resource.ext_device_info || {};
      const deviceId = resource.client_id || resource.id || '—';
      const deviceName = info.device_name || '—';
      const deviceOs = info.os ? `${info.os}${info.os_version ? ` ${info.os_version}` : ''}` : '—';
      return (
        <View key={`${deviceId}-${index}`} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
          <ThemedText>{labels.deviceId}: {deviceId}</ThemedText>
          <ThemedText>{labels.deviceName}: {deviceName}</ThemedText>
          <ThemedText>{labels.deviceOs}: {deviceOs}</ThemedText>
        </View>
      );
    });
  }, [devices, labels]);

  return (
    <View style={{ width: '100%' }}>
      <ThemedText style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{labels.title}</ThemedText>
      {labels.subtitle ? <ThemedText style={{ opacity: 0.8, marginBottom: 12 }}>{labels.subtitle}</ThemedText> : null}

      {error && <ThemedText style={{ opacity: 0.9, marginBottom: 8 }}>{error}</ThemedText>}

      <ThemedButton title={labels.search} onPress={handleSearch} disabled={isLoading} />

      {isLoading && (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {thid && (
        <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
          {labels.status}: {thid}
        </ThemedText>
      )}

      {devices.length === 0 && !isLoading ? (
        <ThemedText style={{ marginTop: 12, opacity: 0.7 }}>{labels.empty}</ThemedText>
      ) : (
        <View style={{ marginTop: 12 }}>{deviceRows}</View>
      )}
    </View>
  );
}

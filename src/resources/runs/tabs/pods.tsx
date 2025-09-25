// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Alert,
  Stack,
  Divider,
} from '@mui/material';


const parseTimeToDate = (value: any): Date | null => {
  if (!value && value !== 0) return null;
  if (typeof value === 'number') {
    if (value > 1_000_000_000_000) return new Date(value);
    return new Date(value * 1000);
  }
  if (typeof value === 'string') {
    const n = Number(value);
    if (!Number.isNaN(n)) return parseTimeToDate(n);
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
};

const formatDateForUI = (d: Date | null) => {
  if (!d) return '-';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
};

function conditionsFromPod(pod: any) {
  const conds = pod?.conditions || [];
  return conds.map((c: any) => {
    const time = parseTimeToDate(c.lastTransitionTime || c.lastProbeTime || c.time);
    return {
      time,
      type: c.type || '-',
      status: c.status ?? '-',
      reason: c.reason ?? '-',
    };
  });
}

function getPodStateAndMessage(pod: any) {
  const cs = pod?.status?.containerStatuses || pod?.containers || pod?.status?.containers || [];
  if (Array.isArray(cs) && cs.length > 0) {
    const c = cs[0];
    if (c?.state && typeof c.state === 'object') {
      if (c.state.terminated) {
        const t = c.state.terminated;
        const time = parseTimeToDate(t.finishedAt || t.startedAt);
        return {
          state: `terminated (${t.reason || 'Completed'})`,
          message: t.message || undefined,
          time,
        };
      } else if (c.state.waiting) {
        const w = c.state.waiting;
        return {
          state: `waiting (${w.reason || 'Waiting'})`,
          message: w.message || undefined,
          time: parseTimeToDate(w.startedAt || null),
        };
      } else if (c.state.running) {
        const r = c.state.running;
        return { state: 'running', message: undefined, time: parseTimeToDate(r.startedAt || null) };
      }
    }
    if (typeof c.state === 'string') {
      return {
        state: c.state,
        message: c.message || undefined,
        time: null,
      };
    }
    if (c?.state && typeof c.state === 'string') {
      return { state: c.state, message: c?.message || undefined, time: null };
    }
  }
  return { state: pod?.phase || pod?.status?.phase || '-', message: undefined, time: null };
}


export default function PodsTab(props: { record: any }) {

  const { record } = props;
  const recordPodsFromStatus =
    record?.status?.pods && Array.isArray(record.status.pods) ? record.status.pods : undefined;
  const recordPodsFromK8s =
    record?.status?.k8s?.pods && Array.isArray(record.status.k8s.pods) ? record.status.k8s.pods : undefined;


  const recordPods = recordPodsFromStatus ?? recordPodsFromK8s ?? [];
  const pods: any[] =  recordPods;

  const generateNames = useMemo(() => {
    const s = new Set<string>();
    pods.forEach((p) => {
      const gn = p?.metadata?.generateName || p?.metadata?.name || p?.name;
      if (gn) s.add(gn);
    });
    return Array.from(s);
  }, [pods]);

  const [selectedGenerateName, setSelectedGenerateName] = useState<string>('');

  useEffect(() => {
    if (selectedGenerateName && !generateNames.includes(selectedGenerateName)) {
      setSelectedGenerateName('');
    }
  }, [generateNames, selectedGenerateName]);

  const selectedPods = useMemo(() => {
    if (!selectedGenerateName) return [];
    return pods.filter((p) => {
      const gn = p?.metadata?.generateName || p?.metadata?.name || p?.name;
      return gn === selectedGenerateName;
    });
  }, [pods, selectedGenerateName]);

  const firstPod = selectedPods.length > 0 ? selectedPods[0] : null;

  const podName = firstPod?.metadata?.name ?? firstPod?.name ?? '-';
  const podNamespace = firstPod?.metadata?.namespace ?? firstPod?.namespace ?? '-';
  const podPhase = firstPod?.status?.phase ?? firstPod?.phase ?? '-';
  const startTimeRaw = firstPod?.status?.startTime ?? firstPod?.startTime ?? firstPod?.metadata?.creationTimestamp ?? null;
  const startTime = parseTimeToDate(startTimeRaw);
  const formattedStart = formatDateForUI(startTime);

  const userFromRecord = record?.user ?? record?.metadata?.updated_by ?? record?.metadata?.created_by ?? null;
  const userFromLabels =
    firstPod?.metadata?.labels?.['tenant1/user'] ||
    firstPod?.metadata?.labels?.['tenant/user'] ||
    firstPod?.metadata?.labels?.user ||
    null;
  const podUser = userFromRecord || userFromLabels || '-';

  const { state: podState, message: podMessage } = firstPod ? getPodStateAndMessage(firstPod) : { state: '-', message: undefined };

  const conditionsRows = firstPod ? conditionsFromPod(firstPod) : [];

  const sortedConditions = conditionsRows.slice().sort((a, b) => {
    const ta = a.time ? a.time.getTime() : -Infinity;
    const tb = b.time ? b.time.getTime() : -Infinity;
    return tb - ta;
  });

  const MetaField = ({ label, value }: { label: string; value: any }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
      <Typography variant="body2" sx={{ minWidth: 160, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ ml: 2, wordBreak: 'break-word' }}>
        {value ?? '-'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 0,width: '100%' }}>
      <Box sx={{ p: 1 }}>
        <Card>
          <CardContent sx={{ '&:last-child': { pb: 2 } }}>
            <Stack spacing={1}>
              <Typography variant="h6">Pods</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="pods-select-label">Pod</InputLabel>
                <Select
                  labelId="pods-select-label"
                  value={selectedGenerateName}
                  label="Pod"
                  onChange={(e) => setSelectedGenerateName(e.target.value as string)}
                  fullWidth
                  MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                >
                  {generateNames.length > 0 ? (
                    generateNames.map((gn) => (
                      <MenuItem key={gn} value={gn}>
                        {gn}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      (no pods)
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {selectedGenerateName && (
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Pod metadata
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MetaField label="Name" value={podName} />
                      <MetaField label="Start time" value={formattedStart} />
                      <MetaField label="Phase" value={podPhase} />
                      <MetaField label="Namespace" value={podNamespace} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MetaField label="State" value={podState} />
                      <MetaField label="Message" value={podMessage ?? record?.status?.message ?? '-'} />
                      <MetaField label="User" value={podUser} />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Conditions
                  </Typography>

                  {sortedConditions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No conditions available for this pod.
                    </Typography>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedConditions.map((r, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{formatDateForUI(r.time)}</TableCell>
                            <TableCell>{r.type}</TableCell>
                            <TableCell>{r.status}</TableCell>
                            <TableCell>{r.reason ?? '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../src/components/common';
import { TopVoiceLanguageBar } from '../../src/components/TopVoiceLanguageBar';
import { MOCK_TRANSACTIONS } from '../../src/services/mock-data.service';
import { useAppContext } from '../../src/store/app-context';
import { useOperatorStore } from '../../src/store/operator.store';
import {
  KPICard,
  TransactionCard,
  AlertCard,
  OperatorQrModal,
} from '../../src/components/operator';
import { getOperatorTexts } from '../../src/i18n/operator-translations';

export default function OperatorDashboard() {
  const router = useRouter();
  const { state } = useAppContext();


  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Top Multilingual & Accessibility Voice Bar (Unified Kisan Mitra Bar) */}
      <TopVoiceLanguageBar
        voiceText={t.voiceDashboard}
        variant="light"
        showVoice={true}
        showLang={true}
        showScale={true}
      />


      </View>

      {/* 3. PROCUREMENT PROGRESS (Section 5) */}
      <KisanCard style={styles.progressCard}>
        <Text style={styles.sectionCardTitle}>{t.procurementProgress}</Text>

        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressSubLabel}>{t.targetLabel}</Text>
            <Text style={styles.progressValue}>{targetQtl.toLocaleString()} Qtl</Text>
          </View>
          <View>
            <Text style={styles.progressSubLabel}>{t.completedLabel}</Text>
            <Text style={[styles.progressValue, { color: colors.primary }]}>
              {procuredQtl.toLocaleString()} Qtl
            </Text>
          </View>
          <View>
            <Text style={styles.progressSubLabel}>{t.remainingLabel}</Text>
            <Text style={[styles.progressValue, { color: colors.secondary }]}>
              {remainingQtl.toLocaleString()} Qtl
            </Text>
          </View>
          <View style={styles.progressPercentBadge}>
            <Text style={styles.progressPercentText}>{kpis.percentAchieved}%</Text>
          </View>
        </View>

        {/* Clean Progress Visualization */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(100, Math.max(5, kpis.percentAchieved))}%` },
            ]}
          />
        </View>
      </KisanCard>

      {/* 4. LIVE OPERATION STATUS (Section 6) */}
      <SectionHeader
        title={t.liveOperationStatus}
        subtitle={t.liveOperationSubtitle}
      />
      <KisanCard style={styles.activeTokenCard}>
        <View style={styles.activeTokenHeader}>
          <View style={styles.tokenPill}>
            <Text style={styles.tokenPillLabel}>{t.currentToken}</Text>
            <Text style={[styles.tokenPillNumber, { fontSize: 24 * scale }]}>
              {currentServing.token}
            </Text>
          </View>
          <StatusBadge status={currentServing.stage as any} />
        </View>

        <View style={styles.activeTokenDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.farmer}:</Text>
            <Text style={styles.detailValue}>{currentServing.farmer}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.crop}:</Text>
            <Text style={styles.detailValue}>{currentServing.crop}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.vehicle}:</Text>
            <Text style={styles.detailValue}>{currentServing.vehicle}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.quantity}:</Text>
            <Text style={styles.detailValue}>{currentServing.quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.lane}:</Text>
            <Text style={[styles.detailValue, { color: colors.secondary, fontWeight: 'bold' }]}>
              {currentServing.lane}
            </Text>
          </View>
        </View>

        <View style={styles.tokenActionRow}>
          <TouchableOpacity
            style={styles.viewTxBtn}
            onPress={() => router.push(`/(operator)/farmer/${currentServing.transactionId || 'TX-2026-001'}` as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={16} color={colors.secondary} />
            <Text style={styles.viewTxBtnText}>{t.viewTransaction}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callNextBtn}
            onPress={handleCallNext}
            activeOpacity={0.8}
          >
            <Ionicons name="megaphone" size={16} color="#FFFFFF" />
            <Text style={styles.callNextBtnText}>{t.callNextToken}</Text>
          </TouchableOpacity>
        </View>

        {/* Next Tokens Queue Preview */}
        <View style={styles.nextTokensBox}>
          <Text style={styles.nextTokensTitle}>{t.nextTokensInLine}</Text>
          <View style={styles.nextTokensList}>
            {nextTokens.length === 0 ? (
              <Text style={{ fontSize: 12, color: '#9E9E9E', fontStyle: 'italic' }}>
                {t.queueClear}
              </Text>
            ) : (
              nextTokens.map((item) => (
                <TouchableOpacity
                  key={item.token}
                  style={styles.nextTokenBadge}
                  onPress={() => router.push('/(operator)/queue')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.nextTokenText}>{item.token}</Text>
                  <Text style={styles.nextTokenStatus}>{item.status}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </KisanCard>

      {/* OPERATIONS QUICK ACTIONS */}
      <SectionHeader title={t.quickActionsTitle} subtitle={t.quickActionsSub} />
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => setQrModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#0D47A1' }]}>
            <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaScanQr}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(operator)/queue')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="list" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaLiveQueue}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(operator)/operations/quality-check')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="flask" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaQualityCheck}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(operator)/operations/weighing')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="scale" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaWeighing}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(operator)/operations/procurement')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#7B1FA2' }]}>
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaProcurement}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(operator)/exceptions')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#C2185B' }]}>
            <Ionicons name="warning-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.quickActionTitle}>{t.qaExceptions}</Text>
        </TouchableOpacity>
      </View>

      {/* 7. ALERTS PANEL (Section 9) */}
      <SectionHeader
        title={t.operationalAlerts}
        subtitle={t.operationalAlertsSub}
      />
      <KisanCard style={styles.alertsCard}>
        {alerts.length === 0 ? (
          <Text style={{ color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center' }}>
            {t.noAlertsPending}
          </Text>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onPress={() => {
                if (alert.id === 'ALT-1') router.push('/(operator)/operations/quality-check');
                else if (alert.id === 'ALT-2') router.push('/(operator)/queue');
                else if (alert.id === 'ALT-3') router.push('/(operator)/operations/weighing');
                else if (alert.id === 'ALT-4') router.push('/(operator)/operations/procurement');
              }}
              onDismiss={dismissAlert}
            />
          ))
        )}
      </KisanCard>

      {/* 8. RECENT TRANSACTIONS TABLE (Section 8) */}
      <SectionHeader title={t.recentTransactionsTitle} subtitle={t.recentTransactionsSub} />
      <KisanCard style={styles.recentTxCard}>
        {recentTransactions.map((tx) => (
          <TransactionCard
            key={`${tx.token}-${tx.time}`}
            token={tx.token}
            farmer={tx.farmer}
            crop={tx.crop}
            quantity={tx.qty}
            stage={tx.stage}
            status={tx.status}
            time={tx.time}
            scale={scale}
            onPress={() => router.push('/(operator)/farmer/TX-2026-001' as any)}
          />
        ))}
      </KisanCard>

      <View style={{ height: 32 }} />

      {/* QR Scanner Modal */}
      <OperatorQrModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        onSelectTransaction={(tx) => {
          setQrModalVisible(false);
          router.push(`/(operator)/operations/check-in?txId=${tx.id}` as any);
        }}
        transactions={MOCK_TRANSACTIONS}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiItem: {
    width: '48%',
    flexGrow: 1,
  },
  progressCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#616161',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressSubLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  progressPercentBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  activeTokenCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  activeTokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tokenPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  tokenPillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tokenPillNumber: {
    fontWeight: '900',
    color: colors.primary,
    marginTop: 2,
  },
  activeTokenDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  detailItem: {
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  tokenActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  viewTxBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: '#E3F2FD',
    gap: 6,
  },
  viewTxBtnText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 12,
  },
  callNextBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 6,
  },
  callNextBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  nextTokensBox: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  nextTokensTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  nextTokensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nextTokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    gap: 6,
  },
  nextTokenText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nextTokenStatus: {
    fontSize: 10,
    color: '#757575',
  },
  laneCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickActionCard: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  alertsCard: {
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  recentTxCard: {
    padding: spacing.xs,
  },
});
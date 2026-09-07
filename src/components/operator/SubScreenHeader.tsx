import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAppContext } from '../../store/app-context';

interface SubScreenHeaderProps {
  title?: string;
  subtitle?: string;
}

export const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const isHi = state.language === 'hi';
  const isOr = state.language === 'or';

  const scale = state.textScale || 1.0;
  const backLabel = isOr ? '‹ ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ' : isHi ? '‹ डैशबोर्ड पर वापस जाएं' : '‹ Back to Dashboard';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push('/(operator)')}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={18 * scale} color={colors.primary} />
        <Text style={[styles.backText, { fontSize: 14 * scale }]}>{backLabel}</Text>
      </TouchableOpacity>

      {title ? (
        <View style={styles.titleBox}>
          <Text style={[styles.titleText, { fontSize: 18 * scale }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitleText, { fontSize: 12 * scale }]}>{subtitle}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  titleBox: {
    marginTop: 6,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

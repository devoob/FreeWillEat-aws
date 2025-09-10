import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePhysicalProfile } from '@/contexts/PhysicalProfileContext';
import { getColors, spacing, borderRadius, typography, getThemeStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectionCard from '@/components/ui/SelectionCard';
import NumberInput from '@/components/ui/NumberInput';
import StatsWidget from '@/components/ui/StatsWidget';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';
import { 
  PhysicalData, 
  BMRData, 
  calculateBMR,
  WeightUnit,
  HeightUnit,
  Gender
} from '@/utils/bmrCalculator';

const genderOptions = [
  {
    value: 'male' as const,
    title: 'Male',
    icon: 'male' as const,
  },
  {
    value: 'female' as const,
    title: 'Female',
    icon: 'female' as const,
  },
  {
    value: 'other' as const,
    title: 'Other',
    icon: 'person' as const,
  },
];

const PhysicalProfileSettings = () => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const themeStyles = getThemeStyles(activeTheme);
  const { physicalData, bmrData, updatePhysicalProfile, updateBMR } = usePhysicalProfile();

  const [showContent, setShowContent] = React.useState(false);
  const [localPhysicalData, setLocalPhysicalData] = React.useState<PhysicalData>({
    age: null,
    height: { value: null, unit: 'cm' },
    weight: { value: null, unit: 'kg' },
    gender: null,
  });
  const [saving, setSaving] = React.useState(false);
  const [isManualBMR, setIsManualBMR] = React.useState(false);
  const [manualBMRValue, setManualBMRValue] = React.useState<number | null>(null);

  // Initialize local data from context
  React.useEffect(() => {
    if (physicalData) {
      setLocalPhysicalData(physicalData);
    }
    if (bmrData) {
      setIsManualBMR(bmrData.isManual);
      setManualBMRValue(bmrData.manual);
    }
  }, [physicalData, bmrData]);

  const onToggle = () => {
    setShowContent(!showContent);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update physical data
      await updatePhysicalProfile(localPhysicalData);
      
      // Calculate new BMR
      const calculatedBMR = calculateBMR(localPhysicalData);
      
      // Update BMR data
      await updateBMR({
        calculated: calculatedBMR,
        manual: manualBMRValue,
        isManual: isManualBMR,
      });

      Alert.alert('Success', 'Physical profile updated successfully!');
      
      // Close the accordion after successful save
      setShowContent(false);
    } catch (error) {
      console.error('Error saving physical profile:', error);
      Alert.alert('Error', 'Failed to save physical profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculatedBMR = React.useMemo(() => {
    return calculateBMR(localPhysicalData);
  }, [localPhysicalData]);

  const effectiveBMR = React.useMemo(() => {
    if (isManualBMR && manualBMRValue) {
      return manualBMRValue;
    }
    return calculatedBMR;
  }, [isManualBMR, manualBMRValue, calculatedBMR]);

  const canCalculateBMR = localPhysicalData.age && 
                          localPhysicalData.height.value && 
                          localPhysicalData.weight.value && 
                          localPhysicalData.gender;

  return (
    <View style={!showContent ? styles.closedSection : undefined}>
      <CollapsibleSectionHeader
        title="Physical Profile"
        subtitle="Set your physical stats to calculate BMR"
        icon="fitness-center"
        isExpanded={showContent}
        onToggle={onToggle}
      />
      {showContent && (
        <View style={[
          styles.collapsibleContent,
          {
            backgroundColor: themeColors.backgroundWhite,
            borderColor: themeColors.borderLight,
          }
        ]}>
          <View style={[styles.sectionDivider, { backgroundColor: themeColors.borderLight }]} />
          
          <View style={styles.verticalContent}>
            {/* Height */}
            <View style={styles.inputSection}>
              <NumberInput
                label="Height"
                value={localPhysicalData.height.value}
                onValueChange={(value) => setLocalPhysicalData(prev => ({ 
                  ...prev, 
                  height: { ...prev.height, value }
                }))}
                placeholder="Enter height"
                unit="cm"
                min={100}
                max={250}
                step={1}
                icon="height"
              />
            </View>

            {/* Weight */}
            <View style={styles.inputSection}>
              <NumberInput
                label="Weight"
                value={localPhysicalData.weight.value}
                onValueChange={(value) => setLocalPhysicalData(prev => ({ 
                  ...prev, 
                  weight: { ...prev.weight, value }
                }))}
                placeholder="Enter weight"
                unit="kg"
                min={30}
                max={200}
                step={1}
                icon="monitor-weight"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputSection}>
              <SectionHeader
                title="Gender"
                subtitle="Used for BMR calculation (all options supported)"
                icon="person"
              />
              {genderOptions.map((gender) => (
                <SelectionCard
                  key={gender.value}
                  title={gender.title}
                  icon={gender.icon}
                  selected={localPhysicalData.gender === gender.value}
                  onPress={() => setLocalPhysicalData(prev => ({ ...prev, gender: gender.value }))}
                />
              ))}
            </View>

            {/* Age - Added for BMR calculation */}
            <View style={styles.inputSection}>
              <NumberInput
                label="Age"
                value={localPhysicalData.age}
                onValueChange={(value) => setLocalPhysicalData(prev => ({ ...prev, age: value }))}
                placeholder="Enter age"
                unit="years"
                min={13}
                max={120}
                step={1}
                icon="calendar-today"
              />
            </View>

            {/* Arrow pointing down */}
            <View style={styles.arrowContainer}>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={32} 
                color={themeColors.primary} 
              />
            </View>

            {/* BMR Display */}
            <View style={styles.bmrSection}>
              <SectionHeader
                title="Basal Metabolic Rate (BMR)"
                subtitle="Calories your body needs at rest per day"
                icon="local-fire-department"
              />
              
              <View style={[themeStyles.row, { gap: spacing.xs, marginBottom: spacing.md }]}>
                <Button
                  title="Auto Calculate"
                  onPress={() => setIsManualBMR(false)}
                  size="small"
                  variant={!isManualBMR ? 'primary' : 'secondary'}
                  style={{ minWidth: 50 }}
                />
                <Button
                  title="Manual Input"
                  onPress={() => setIsManualBMR(true)}
                  size="small"
                  variant={isManualBMR ? 'primary' : 'secondary'}
                  style={{ minWidth: 50 }}
                />
              </View>

              {isManualBMR ? (
                <NumberInput
                  label="Manual BMR"
                  value={manualBMRValue}
                  onValueChange={setManualBMRValue}
                  placeholder="Enter BMR manually"
                  unit="calories/day"
                  min={800}
                  max={4000}
                  step={1}
                  icon="edit"
                />
              ) : (
                <StatsWidget
                  title="Calculated BMR"
                  value={canCalculateBMR && calculatedBMR ? `${calculatedBMR}` : '---'}
                  subtitle={canCalculateBMR && calculatedBMR ? 'calories/day' : 'Enter all data to calculate'}
                  icon="local-fire-department"
                />
              )}
              
              {!isManualBMR && canCalculateBMR && calculatedBMR && (
                <Text style={[styles.bmrDescription, { color: themeColors.textSecondary }]}>
                  This is your Basal Metabolic Rate - the calories your body needs at rest.
                </Text>
              )}
            </View>
          </View>

          {/* Save Button */}
          <Button
            title={saving ? "Saving..." : "Save Physical Profile"}
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closedSection: {
    marginBottom: spacing.lg,
  },
  collapsibleContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionDivider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: spacing.lg,
  },
  verticalContent: {
    flex: 1,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  bmrSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bmrDescription: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

export default PhysicalProfileSettings;
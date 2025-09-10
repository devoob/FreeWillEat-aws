import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { UserPreferences } from '@/contexts/PreferencesContext';
import { getColors, getComponentStyles, spacing, borderRadius } from '@/styles/globalStyles';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectionCard from '@/components/ui/SelectionCard';
import TagInput from '@/components/ui/TagInput';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';

const cookingLevels = [
  {
    value: 'beginner' as const,
    title: 'Beginner',
    description: 'Simple recipes with basic techniques',
    icon: 'star' as const,
  },
  {
    value: 'intermediate' as const,
    title: 'Intermediate',
    description: 'Moderate complexity with some advanced techniques',
    icon: 'star-half' as const,
  },
  {
    value: 'advanced' as const,
    title: 'Advanced',
    description: 'Complex recipes for experienced cooks',
    icon: 'stars' as const,
  },
  {
    value: 'michelin' as const,
    title: 'Michelin',
    description: 'Restaurant-quality with sophisticated techniques',
    icon: 'restaurant' as const,
  },
];

const regionPreferences = [
  { value: 'any' as const, title: 'Any Cuisine', icon: 'public' as const },
  { value: 'american' as const, title: 'American', icon: 'local-dining' as const },
  { value: 'asian' as const, title: 'Asian', icon: 'restaurant' as const },
  { value: 'european' as const, title: 'European', icon: 'local-cafe' as const },
  { value: 'mediterranean' as const, title: 'Mediterranean', icon: 'local-pizza' as const },
  { value: 'mexican' as const, title: 'Mexican', icon: 'local-bar' as const },
  { value: 'indian' as const, title: 'Indian', icon: 'restaurant-menu' as const },
];

const mealPreferences = [
  {
    value: 'any' as const,
    title: 'Any Style',
    description: 'No specific preference',
    icon: 'dining' as const,
  },
  {
    value: 'healthy' as const,
    title: 'Healthy',
    description: 'Nutritious, low in processed ingredients',
    icon: 'eco' as const,
  },
  {
    value: 'balanced' as const,
    title: 'Balanced',
    description: 'Well-rounded nutritional balance',
    icon: 'balance' as const,
  },
  {
    value: 'comfort' as const,
    title: 'Comfort Food',
    description: 'Hearty, satisfying meals',
    icon: 'favorite' as const,
  },
  {
    value: 'junk food' as const,
    title: 'Junk Food',
    description: 'Indulgent, delicious, and satisfying without worrying about health',
    icon: 'fastfood' as const,
  },
];

const commonDietaryRestrictions = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'low-carb',
  'keto',
  'paleo',
];

interface MealPreferencesProps {
  showMealPreferences: boolean;
  onToggle: () => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  saving: boolean;
  onSave: () => void;
}

const MealPreferences: React.FC<MealPreferencesProps> = ({
  showMealPreferences,
  onToggle,
  preferences,
  setPreferences,
  saving,
  onSave,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const themeComponentStyles = getComponentStyles(activeTheme);

  const addDietaryRestriction = (restriction: string) => {
    if (!preferences.dietaryRestrictions.includes(restriction)) {
      setPreferences(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction],
      }));
    }
  };

  const removeDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction),
    }));
  };

  return (
    <View style={!showMealPreferences ? styles.closedSection : undefined}>
      <CollapsibleSectionHeader
        title="Meal Preferences"
        subtitle="Configure your cooking and dietary preferences"
        icon="restaurant-menu"
        isExpanded={showMealPreferences}
        onToggle={onToggle}
      />
      {showMealPreferences && (
        <View style={[
          styles.collapsibleContent,
          {
            backgroundColor: themeColors.backgroundWhite,
            borderColor: themeColors.borderLight,
          }
        ]}>
          <View style={[styles.sectionDivider, { backgroundColor: themeColors.borderLight }]} />
          
          {/* Cooking Level */}
          <View style={styles.subsection}>
            <SectionHeader
              title="Cooking Level"
              subtitle="Choose your cooking experience level"
              icon="local-fire-department"
            />
            {cookingLevels.map((level) => (
              <SelectionCard
                key={level.value}
                title={level.title}
                description={level.description}
                icon={level.icon}
                selected={preferences.cookingLevel === level.value}
                onPress={() => setPreferences(prev => ({ ...prev, cookingLevel: level.value }))}
              />
            ))}
          </View>

          {/* Cuisine Preference */}
          <View style={styles.subsection}>
            <SectionHeader
              title="Cuisine Preference"
              subtitle="Select your preferred cuisine style"
              icon="public"
            />
            {regionPreferences.map((region) => (
              <SelectionCard
                key={region.value}
                title={region.title}
                icon={region.icon}
                selected={preferences.regionPreference === region.value}
                onPress={() => setPreferences(prev => ({ ...prev, regionPreference: region.value }))}
              />
            ))}
          </View>

          {/* Meal Style */}
          <View style={styles.subsection}>
            <SectionHeader
              title="Meal Style"
              subtitle="Choose your preferred meal approach"
              icon="restaurant-menu"
            />
            {mealPreferences.map((meal) => (
              <SelectionCard
                key={meal.value}
                title={meal.title}
                description={meal.description}
                icon={meal.icon}
                selected={preferences.mealPreference === meal.value}
                onPress={() => setPreferences(prev => ({ ...prev, mealPreference: meal.value }))}
              />
            ))}
          </View>

          {/* Dietary Restrictions */}
          <View style={styles.subsection}>
            <SectionHeader
              title="Dietary Restrictions"
              subtitle="Select your dietary requirements"
              icon="no-meals"
            />
            <View style={themeComponentStyles.chipContainer}>
              {commonDietaryRestrictions.map((restriction) => (
                <Button
                  key={restriction}
                  title={restriction}
                  variant={preferences.dietaryRestrictions.includes(restriction) ? 'primary' : 'secondary'}
                  size="small"
                  onPress={() => 
                    preferences.dietaryRestrictions.includes(restriction)
                      ? removeDietaryRestriction(restriction)
                      : addDietaryRestriction(restriction)
                  }
                  style={themeComponentStyles.chip}
                />
              ))}
            </View>
          </View>

          {/* Allergies */}
          <View style={styles.subsection}>
            <SectionHeader
              title="Allergies"
              subtitle="Add any food allergies or ingredients to avoid"
              icon="warning"
            />
            <TagInput
              title=""
              tags={preferences.allergies}
              onTagsChange={(allergies) => setPreferences(prev => ({ ...prev, allergies }))}
              placeholder="e.g., peanuts, shellfish"
              maxTags={10}
            />
          </View>

          {/* Save Preferences Button */}
          <Button
            title="Save Meal Preferences"
            onPress={onSave}
            loading={saving}
            disabled={saving}
            size="large"  
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
  subsection: {
    marginTop: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

export default MealPreferences;
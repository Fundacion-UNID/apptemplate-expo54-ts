// constants/Styles.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';

// Centralized base dimensions
export const AppDimensions = {
  // Font Sizes
  title: 18,
  subtitle: 13,
  description: 11,
  body: 16,
  formInput: 14,
  formLabel: 14,
  button: 22,
  formButton: 14,
  cardTitle: 22,
  cardSubtitle: 16,
  cardMeta: 14,
  badge: 12,

  // Borders
  mainBorderRadius: 8,
  mainBorderWidth: 1,

    // Icon Sizes
  logo: 65,              // Reduced by 30%
  badgeIcon: 16,
  cardIcon: 28,

  // Spacing
  containerPadding: 20,
  headerMarginBottom: 8,
  titleMarginBottom: 4,
  subtitleMarginBottom: 8, // Reverted to original spacing
  itemMargin: 16,
};

export const getScreenStyles = (scaleFactor = 1, tintColor?: string) => {
  const resolvedTintColor = tintColor ?? '#007aff';

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(AppDimensions.containerPadding * scaleFactor),
      justifyContent: 'center',
    },
    scrollContainer: {
      padding: scale(AppDimensions.containerPadding * scaleFactor),
      paddingTop: scale(10 * scaleFactor), // Reduced top padding further
      flexGrow: 1,
    },
    title: {
      fontWeight: '600',
      marginTop: -scale(AppDimensions.itemMargin * 0.5 * scaleFactor), // Move title up
      marginBottom: scale(AppDimensions.titleMarginBottom * scaleFactor),
      textAlign: 'center',
      fontSize: moderateScale(AppDimensions.title * scaleFactor),
    },
    subtitle: {
      fontWeight: '400',
      marginBottom: scale(AppDimensions.subtitleMarginBottom * scaleFactor),
      textAlign: 'center',
      fontSize: moderateScale(AppDimensions.subtitle * scaleFactor),
    },
    description: {
      fontWeight: '300',
      marginBottom: scale(AppDimensions.itemMargin * scaleFactor),
      textAlign: 'center',
      fontSize: moderateScale(AppDimensions.description * scaleFactor),
    },
    body: {
      fontSize: moderateScale(AppDimensions.body * scaleFactor),
    },
    input: {
      borderWidth: 1,
      borderRadius: scale(8 * scaleFactor),
      padding: scale(12 * scaleFactor),
      marginBottom: scale(AppDimensions.itemMargin * scaleFactor),
      fontSize: moderateScale(AppDimensions.formInput * scaleFactor), // Use specific form size
    },
    button: {
      paddingVertical: scale(6 * scaleFactor), // Reduced vertical padding
      paddingHorizontal: scale(24 * scaleFactor),
      marginTop: scale(12 * scaleFactor),
      borderRadius: scale(8 * scaleFactor),
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center', // FIX: Center the text/icon horizontally
    },
    buttonText: {
      fontSize: moderateScale(AppDimensions.button * scaleFactor),
      fontWeight: '600',
    },
    formButtonText: {
      fontSize: moderateScale(AppDimensions.formButton * scaleFactor),
      fontWeight: '600',
    },
    textCenter: {
      textAlign: 'center',
    },
    formLabel: {
      fontSize: moderateScale(AppDimensions.formLabel * scaleFactor),
      fontWeight: '400',
      marginBottom: scale(6 * scaleFactor), // Minimal margin-bottom
      textAlign: 'left',
    },
    formGroup: {
      marginBottom: scale(AppDimensions.itemMargin * 0.5 * scaleFactor),
    },
    linkText: {
      fontSize: moderateScale(AppDimensions.formLabel * scaleFactor),
      color: resolvedTintColor,
      textDecorationLine: 'underline',
    },
    errorText: {
      fontSize: moderateScale(AppDimensions.formLabel * scaleFactor),
      color: '#B00020',
    },
    formHeader: {
      fontSize: moderateScale(AppDimensions.formLabel * 1.1 * scaleFactor), // Slightly larger than a label
      fontWeight: '500', // Medium weight for emphasis
      marginTop: scale(AppDimensions.itemMargin * 0.5 * scaleFactor), // Consistent spacing ABOVE the header
      marginBottom: scale(3 * scaleFactor), // Minimal spacing below the header
      textAlign: 'left',
    },
    formSeparatorContainer: {
      marginVertical: scale(4 * scaleFactor),
    },
    formSeparatorText: {
      fontSize: moderateScale(AppDimensions.description * scaleFactor),
    },
    tabGroupLabel: {
      fontSize: moderateScale(AppDimensions.formLabel * scaleFactor),
      fontWeight: '400',
      marginBottom: scale(3 * scaleFactor), // Minimal margin for the group label
      textAlign: 'left',
    },
    // Tab Group Styles
    tabGroupContainer: {
      borderWidth: 1,
      borderColor: resolvedTintColor,
      borderRadius: scale(12 * scaleFactor),
      padding: scale(5 * scaleFactor),
      marginBottom: scale(AppDimensions.itemMargin * scaleFactor),
    },
    tabGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: resolvedTintColor,
      paddingVertical: scale(8 * scaleFactor),
      paddingHorizontal: scale(16 * scaleFactor),
      borderRadius: scale(20 * scaleFactor),
      margin: scale(4 * scaleFactor), // Add margin for spacing when wrapped
    },
    inactiveTab: {
      paddingVertical: scale(8 * scaleFactor),
      paddingHorizontal: scale(16 * scaleFactor),
      margin: scale(4 * scaleFactor), // Add margin for spacing when wrapped
    },
    activeTabText: {
      fontSize: moderateScale(AppDimensions.description * scaleFactor), // Smaller font size
      fontWeight: 'normal', // Removed bold
    },
    inactiveTabText: {
      fontSize: moderateScale(AppDimensions.description * scaleFactor), // Smaller font size
      fontWeight: 'normal',
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '70%',
      borderRadius: scale(10 * scaleFactor),
      padding: scale(AppDimensions.containerPadding * scaleFactor),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(AppDimensions.itemMargin * scaleFactor),
    },
    modalSectionTitle: {
      fontWeight: 'bold',
      fontSize: moderateScale(AppDimensions.subtitle * 1.1 * scaleFactor),
      marginTop: scale(AppDimensions.itemMargin * 0.5 * scaleFactor),
      marginBottom: scale(AppDimensions.titleMarginBottom * scaleFactor),
    },
    modalJobItem: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scale(12 * scaleFactor),
      borderBottomWidth: 1,
    },
    jobInfoContainer: {
      flex: 3,
      flexDirection: 'column',
      marginRight: scale(10 * scaleFactor),
    },
    jobActionsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalJobId: {
      flex: 1, 
      marginRight: scale(8 * scaleFactor),
      fontSize: moderateScale(AppDimensions.formInput * scaleFactor),
    },
    modalJobStatus: {
      fontWeight: 'bold',
      fontSize: moderateScale(AppDimensions.formInput * scaleFactor),
    },
    modalEmptyText: {
      fontStyle: 'italic',
      paddingVertical: scale(20 * scaleFactor),
    },
    filePickerName: {
        fontStyle: 'italic',
        fontSize: moderateScale(AppDimensions.formInput * scaleFactor),
        marginTop: scale(6 * scaleFactor),
    },
  });
};

export const getModalStyles = (scaleFactor = 1) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: moderateScale(20 * scaleFactor),
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: moderateScale(16 * scaleFactor),
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      marginHorizontal: 10,
    },
  });

export const badgeColors = {
  info: { background: '#2F80ED', text: '#FFFFFF' },
  success: { background: '#27AE60', text: '#FFFFFF' },
  warning: { background: '#F2994A', text: '#1A1A1A' },
  error: { background: '#EB5757', text: '#FFFFFF' },
  neutral: { background: '#BDBDBD', text: '#1A1A1A' },
};

export const getBadgeStyles = (scaleFactor = 1) =>
  StyleSheet.create({
    badgeContainer: {
      position: 'absolute',
      right: -scale(6 * scaleFactor),
      bottom: -scale(6 * scaleFactor),
      minWidth: scale(18 * scaleFactor),
      height: scale(18 * scaleFactor),
      borderRadius: scale(9 * scaleFactor),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(4 * scaleFactor),
    },
    badgeText: {
      fontSize: moderateScale(AppDimensions.badge * scaleFactor),
      fontWeight: '700',
    },
  });

export const getListCardStyles = (scaleFactor = 1) => {
  const sizes = {
    avatar: scale(52 * scaleFactor),
    avatarIcon: moderateScale(22 * scaleFactor),
    badgeIcon: moderateScale(12 * scaleFactor),
    metaIcon: moderateScale(14 * scaleFactor),
    hitSlop: {
      top: scale(8 * scaleFactor),
      bottom: scale(8 * scaleFactor),
      left: scale(8 * scaleFactor),
      right: scale(8 * scaleFactor),
    },
  };

  return {
    sizes,
    ...StyleSheet.create({
      container: {
        flex: 1,
      },
      separator: {
        height: StyleSheet.hairlineWidth,
      },
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12 * scaleFactor),
        paddingHorizontal: scale(12 * scaleFactor),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      profileContainer: {
        marginRight: scale(12 * scaleFactor),
        position: 'relative',
      },
      profileImage: {
        borderRadius: scale(10 * scaleFactor),
      },
      profilePlaceholder: {
        borderRadius: scale(10 * scaleFactor),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB',
      },
      detailsContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      title: {
        fontSize: moderateScale(AppDimensions.cardTitle * scaleFactor),
        fontWeight: '600',
      },
      subtitle: {
        fontSize: moderateScale(AppDimensions.cardSubtitle * scaleFactor),
        marginTop: scale(2 * scaleFactor),
      },
      infoRow: {
        marginTop: scale(2 * scaleFactor),
      },
      infoText: {
        fontSize: moderateScale(AppDimensions.cardMeta * scaleFactor),
      },
      metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(4 * scaleFactor),
      },
      metaText: {
        fontSize: moderateScale(AppDimensions.cardMeta * scaleFactor),
      },
      metaIconContainer: {
        marginRight: scale(4 * scaleFactor),
      },
      dotSeparator: {
        width: scale(4 * scaleFactor),
        height: scale(4 * scaleFactor),
        borderRadius: scale(2 * scaleFactor),
        marginHorizontal: scale(6 * scaleFactor),
      },
    }),
  };
};

export const getChatListStyles = (scaleFactor = 1) => getListCardStyles(scaleFactor);

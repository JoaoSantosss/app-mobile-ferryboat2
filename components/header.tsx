import { Text, View, StyleSheet } from 'react-native';


export default function Header(props : any) {

    return (
        <View style={styles.header}>
                <View style={styles.headerTop}>
                <Text style={styles.title}>{props.title}</Text>
                </View>
                <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'flex-start', 
        paddingTop:50,
        padding: 20,
        height: 150,
        width: '100%',
        backgroundColor: '#155DFC',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffff',
      paddingTop: 20,
    },
    subtitle: {
      fontSize: 16,
      color: '#ffff',
      paddingTop: 10,
    },
})

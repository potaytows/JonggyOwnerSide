{item.type === 'image' ? (
    <Image source={{ uri: item.message }} style={styles.messageImage} />
) : (
    <Text style={[styles.messageText,
    item.sender === 'restaurant' && { backgroundColor: 'grey' },
    item.isLast && { borderTopLeftRadius: 10 },
    item.isFirst && { borderBottomLeftRadius: 10 },
    !group.isOneOfGroup && !item.isFirst && !item.isLast && { borderBottomLeftRadius: 10, borderTopLeftRadius: 10 },
    ]}>{item.message}</Text>
)}
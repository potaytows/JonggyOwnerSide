            <Modal
                animationType="slide"
                transparent={true}
                visible={EditmodalVisible}
                onRequestClose={() => {
                    setEditModal(!EditmodalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {editModes == "table" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>ชื่อโต๊ะ</Text>
                                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
                                    <TextInput
                                        placeholder='ชื่อโต๊ะ'
                                        placeholderTextColor='gray'
                                        style={styles.input}
                                        value={edittableName}
                                        onChangeText={text => (setEditTableName(text))}
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            deleteTable();
                                        }}>
                                        <Text style={styles.textStyle}>ลบ</Text>
                                    </TouchableOpacity>
                                </View>
                                {edittableName != originalname &&
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditTable(); }}>
                                        <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {editModes == "text" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>แก้ไขข้อความ</Text>
                                <TextInput
                                    placeholder='ชื่อโต๊ะ'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={edittableName}
                                    onChangeText={text => (setEditTableName(text))}
                                />
                                {edittableName != originalname &&
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditTable(); }}>
                                        <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        deleteTable();
                                    }}>
                                    <Text style={styles.textStyle}>ลบ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {editModes == "shape" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>แก้ไขรูปทรง</Text>
                                <Button title="แก้ไขขนาด" color="blue" onPress={() => toEditShapeScreen()} />
                                <TextInput
                                    placeholder='Height'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newShapeHeight}
                                    onChangeText={text => setNewHeight(text)}
                                />
                                <TextInput
                                    placeholder='Width'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newShapeWidth}
                                    onChangeText={text => setNewWidth(text)}
                                />
                                <Button title={selectedColor} color={selectedColor} onPress={() => setColorPicker(true)} />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchEditShape(); setEditModal(!EditmodalVisible); setEditTableName("") }}>
                                    <Text style={styles.textStyle}>แก้ไขข้อมูล</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        deleteTable();
                                    }}>
                                    <Text style={styles.textStyle}>ลบ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setEditModal(!EditmodalVisible);
                                        setEditTable("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        }




                    </View>
                </View>
            </Modal>

            {/* add modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);

                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 16, paddingBottom: 20 }}>เพิ่ม Draggable</Text>
                        <View style={styles.modeButtons}>
                            <TouchableOpacity
                                style={[styles.button, addModes == "table" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                    setAddModes("table")
                                }} activeOpacity={1} >
                                <Text style={styles.textStyle}>โต๊ะ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, addModes == "text" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                setAddModes("text")
                            }} activeOpacity={1} >
                                <Text style={styles.textStyle}>ข้อความ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, addModes == "shape" ? styles.selectedMode : styles.unselectedMode]} onPress={() => {
                                setAddModes("shape")
                            }} activeOpacity={1} >
                                <Text style={styles.textStyle}>รูปทรง</Text>
                            </TouchableOpacity>
                        </View>
                        {/* add modal table */}
                        {addModes == "table" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='ชื่อโต๊ะ'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newTableName}
                                    onChangeText={text => setNewTableName(text)}/>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setNewTableName("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {/* add modal text  */}
                        {addModes == "text" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='ข้อความที่ต้องการเพิ่ม'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={newText}
                                    onChangeText={text => setNewText(text)}
                                />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); setNewText("") }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setNewTableName("");
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                        {/* add modal shape */}
                        {addModes == "shape" &&
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholder='Height'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={shapeHeight}
                                    onChangeText={text => setShapeHeight(text)}
                                />
                                <TextInput
                                    placeholder='Width'
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    value={shapeWidth}
                                    onChangeText={text => setShapeWidth(text)}
                                />
                                <Button title={selectedColor} color={selectedColor} onPress={() => setColorPicker(true)} />

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAdd]} onPress={() => { fetchAddDragable(); setModalVisible(!modalVisible); setNewTableName(""); setNewText(""); setShapeHeight(""); setShapeWidth(""); }}>
                                    <Text style={styles.textStyle}>เพิ่ม</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        closeAddModal();
                                    }}>
                                    <Text style={styles.textStyle}>ยกเลิก</Text>
                                </TouchableOpacity>

                            </View>
                        }
                    </View>

                </View>

            </Modal>
            {/* modal colorpicker */}
            
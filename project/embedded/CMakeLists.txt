cmake_minimum_required(VERSION 3.13)

set(PICO_BOARD pico_w)

include(pico_sdk_import.cmake)

project(embedded)
pico_sdk_init()

add_executable(main
	main.c
	tls_common.c
	functions.c
)

pico_enable_stdio_usb(main 1)
pico_enable_stdio_uart(main 0)

pico_add_extra_outputs(main)

target_include_directories(main
	PRIVATE ${CMAKE_CURRENT_LIST_DIR}
	${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
)

target_compile_definitions(main PRIVATE
	WIFI_SSID="ssid"
	WIFI_PASSWORD="password"
)

target_link_libraries(main
	pico_stdlib
	hardware_adc
	hardware_i2c
	picow_tls_client_background
	pico_cyw43_arch_lwip_threadsafe_background
	pico_lwip_mbedtls
	pico_mbedtls
)

# Ignore warnings from lwip code
set_source_files_properties(
	${PICO_LWIP_PATH}/src/apps/altcp_tls/altcp_tls_mbedtls.c
	PROPERTIES
	COMPILE_OPTIONS "-Wno-unused-result"
)

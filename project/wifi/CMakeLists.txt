cmake_minimum_required(VERSION 3.13)

set(PICO_BOARD pico_w)

include(pico_sdk_import.cmake)

project(tls_client)
pico_sdk_init()

add_executable(picow_tls_client_background
	main.c
	tls_common.c
)

pico_enable_stdio_usb(picow_tls_client_background 1)
pico_enable_stdio_uart(picow_tls_client_background 0)

target_compile_definitions(picow_tls_client_background PRIVATE
	WIFI_SSID="ssid"
	WIFI_PASSWORD="password"
)

target_include_directories(picow_tls_client_background PRIVATE
	${CMAKE_CURRENT_LIST_DIR}
	${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
)

target_link_libraries(picow_tls_client_background
	pico_cyw43_arch_lwip_threadsafe_background
	pico_lwip_mbedtls
	pico_mbedtls
	pico_stdlib
)

pico_add_extra_outputs(picow_tls_client_background)

add_executable(picow_tls_client_poll
	main.c
	tls_common.c
)

pico_enable_stdio_usb(picow_tls_client_poll 1)
pico_enable_stdio_uart(picow_tls_client_poll 0)

target_compile_definitions(picow_tls_client_poll PRIVATE
	WIFI_SSID="ssid"
	WIFI_PASSWORD="password"
)

target_include_directories(picow_tls_client_poll PRIVATE
	${CMAKE_CURRENT_LIST_DIR}
	${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
)

target_link_libraries(picow_tls_client_poll
	pico_cyw43_arch_lwip_poll
	pico_lwip_mbedtls
	pico_mbedtls
	pico_stdlib
)

pico_add_extra_outputs(picow_tls_client_poll)

# Ignore warnings from lwip code
set_source_files_properties(
	${PICO_LWIP_PATH}/src/apps/altcp_tls/altcp_tls_mbedtls.c
	PROPERTIES
	COMPILE_OPTIONS "-Wno-unused-result"
)

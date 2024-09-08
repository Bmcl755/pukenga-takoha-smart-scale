cmake_minimum_required(VERSION 3.13)

set(PICO_BOARD pico_w)

include(pico_sdk_import.cmake)

project(adc)
pico_sdk_init()

add_executable(main
	main.c
)

pico_enable_stdio_usb(main 1)
pico_enable_stdio_uart(main 0)

pico_add_extra_outputs(main)

target_include_directories(main
	PRIVATE ${CMAKE_CURRENT_LIST_DIR}
)

target_link_libraries(main
	pico_stdlib
	hardware_adc
)

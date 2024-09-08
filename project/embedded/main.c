#include <stdio.h>
#include <string.h>

#include "pico/stdlib.h"
#include "pico/cyw43_arch.h"
#include "pico/binary_info.h"

#include "hardware/gpio.h"
#include "hardware/adc.h"
#include "hardware/i2c.h"

#include "functions.h"

#define TLS_CLIENT_SERVER "api.mylucy.news"
#define TLS_CLIENT_TIMEOUT_SECS 15

extern bool run_tls_client_test(const uint8_t *cert, size_t cert_len, const char *server, const char *request, int timeout);

#include "defines.h"

int main(void) {
    stdio_init_all();

    adc_init();
    // Make sure GPIO is high-impedance, no pullups etc
    adc_gpio_init(26);
    // Select ADC input 0 (GPIO26)
    adc_select_input(0);

    // This example will use I2C0 on the default SDA and SCL pins (4, 5 on a Pico)
    i2c_init(i2c_default, 100 * 1000);
    gpio_set_function(PICO_DEFAULT_I2C_SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(PICO_DEFAULT_I2C_SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(PICO_DEFAULT_I2C_SDA_PIN);
    gpio_pull_up(PICO_DEFAULT_I2C_SCL_PIN);
    // Make the I2C pins available to picotool
    bi_decl(bi_2pins_with_func(PICO_DEFAULT_I2C_SDA_PIN, PICO_DEFAULT_I2C_SCL_PIN, GPIO_FUNC_I2C));

    lcd_init();

    if (cyw43_arch_init()) {
        printf("failed to initialise\n");
        return 1;
    }

    cyw43_arch_enable_sta_mode();

    while (cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD, CYW43_AUTH_WPA2_AES_PSK, TLS_CLIENT_TIMEOUT_SECS * 1000)) {
        printf("failed to connect, trying again\n");
        cyw43_delay_ms(TLS_CLIENT_TIMEOUT_SECS * 1000);
    }

    printf("connected\n");

    cyw43_arch_gpio_put(CYW43_WL_GPIO_LED_PIN, 1);

    char *email = "example@example.com";  // Set this to the desired email address
    char httpBody[512];  // Ensure buffer is large enough to hold the entire request
    char jsonBody[256];  // Buffer for the JSON payload

    // Prepare the JSON body
    int jsonLength = snprintf(jsonBody, sizeof(jsonBody), "{\"email\":\"%s\", \"survey\":false}", email);

    // Prepare the full HTTP POST request
    int fullLength = snprintf(httpBody, sizeof(httpBody), 
        "POST /addEmailToWaitlist HTTP/1.1\r\n"
        "Host: %s\r\n"
        "Content-Type: application/json\r\n"
        "Connection: close\r\n"
        "Content-Length: %d\r\n"
        "\r\n"
        "%s", 
        TLS_CLIENT_SERVER, jsonLength, jsonBody);

    bool pass = run_tls_client_test(NULL, 0, TLS_CLIENT_SERVER, httpBody, TLS_CLIENT_TIMEOUT_SECS);

    if (!pass) {
        printf("Test failed\n");
        return 1;
    }

    printf("Test succeeded\n");

    /* sleep a bit to let usb stdio write out any buffer to host */
    sleep_ms(1000);

    while (1) {
        // 12-bit conversion, assume max value == ADC_VREF == 3.3 V
        const float conversion_factor = 3.3f / (1 << 12);
        uint16_t result = adc_read();

        char message[15];

        snprintf(message, 15, "Voltage: %f V\n", result * conversion_factor);
        lcd_string(message);

        sleep_ms(100);
        lcd_clear();
    }
}
#include "pico/stdlib.h"
#include "pico/cyw43_arch.h"

#define TLS_CLIENT_SERVER "capstone-project-team-15.onrender.com"
#define TLS_CLIENT_TIMEOUT_SECS 15

extern bool run_tls_client_test(const uint8_t *cert, size_t cert_len, const char *server, const char *request, int timeout);

int main(void)
{
    /* Connect to Wi-Fi **************************************************************************/
    
    stdio_init_all();

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

    /*********************************************************************************************/

    
    /* Send POST login request *******************************************************************/

    char *r_username = "Kailyn21";
    char *r_password = "rPzLnMRYZGJ18NE";
    char httpBody[512];  // Ensure buffer is large enough to hold the entire request
    char jsonBody[256];  // Buffer for the JSON payload

    // Prepare the JSON body
    int jsonLength = snprintf(jsonBody, sizeof(jsonBody), "{\"username\":\"%s\", \"password\":\"%s\"}", r_username, r_password);

    // Prepare the full HTTP POST request
    int fullLength = snprintf(httpBody, sizeof(httpBody), 
        "POST /login HTTP/1.1\r\n"
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

    /*********************************************************************************************/



    /* Send POST new weighing request ************************************************************/

    float r_weight = 2.5;

    // Prepare the JSON body
    jsonLength = snprintf(jsonBody, sizeof(jsonBody), "{\"weight\": %f}", r_weight);

    // Prepare the full HTTP POST request (authorization token is hardcoded)
    fullLength = snprintf(httpBody, sizeof(httpBody), 
        "POST /scales/test_scale HTTP/1.1\r\n"
        "Host: %s\r\n"
        "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJudXJzZUlkIjoiNjYzMTY4ZGYzNmFhZDViYTljMDMxYjMzIiwiaWF0IjoxNzE1OTI0Mjg0LCJleHAiOjE3MTYwMTA2ODR9.5Or19I4jnzLaEhhD-TgdufKmnHnt4Yr2pTD9-M3Svts\r\n"
        "Content-Type: application/json\r\n"
        "Connection: close\r\n"
        "Content-Length: %d\r\n"
        "\r\n"
        "%s", 
        TLS_CLIENT_SERVER, jsonLength, jsonBody);

    pass = run_tls_client_test(NULL, 0, TLS_CLIENT_SERVER, httpBody, TLS_CLIENT_TIMEOUT_SECS);

    if (!pass) {
        printf("Test failed\n");
        return 1;
    }

    printf("Test succeeded\n");

    /* sleep a bit to let usb stdio write out any buffer to host */
    sleep_ms(1000);

    /*********************************************************************************************/
}

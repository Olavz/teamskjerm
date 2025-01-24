package app.teamskjerm.inforskjerm.conf

import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig : WebSocketMessageBrokerConfigurer {

    override fun configureMessageBroker(config: org.springframework.messaging.simp.config.MessageBrokerRegistry) {
        // Aktiver en enkel meldingsmegler med prefikset "/topic"
        config.enableSimpleBroker("/komponent", "/ping")

        // Sti for meldinger fra klienten til serveren
        config.setApplicationDestinationPrefixes("/app")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        // Endepunkt for WebSocket-tilkobling, med fallback til SockJS
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS()
    }
}
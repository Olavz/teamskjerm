package app.teamskjerm.inforskjerm

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class ReactRoutingController {

    @RequestMapping(value = ["/", "/{x:[\\w\\-]+}", "/{x:^(?!api$).*$}/*/{y:[\\w\\-]+}", "/error"])
    fun redirect(): String {
        return "forward:/index.html"
    }
}
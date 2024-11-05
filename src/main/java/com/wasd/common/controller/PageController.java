package com.wasd.common.controller;

import com.wasd.config.security.CustomOAuth2User;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collection;

@Controller
public class PageController {

    @Autowired
    private GroupService groupService;

    @GetMapping({"/login", "/"})
    public String loginPage(@AuthenticationPrincipal CustomOAuth2User oAuth2User){
        if (oAuth2User != null) {
            return "redirect:/join";
        }
        // 인증되지 않은 경우 로그인 페이지를 보여줌
        return "/pages/user/login";
    }

    @GetMapping("/join")
    public String joinPage(Model model, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        Collection<? extends GrantedAuthority> authorities = oAuth2User.getAuthorities();
        boolean isSigned = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_USER"));
        if(isSigned){
            return "redirect:/main";
        }

        model.addAttribute("oauth", oAuth2User.getUserInfo());
        return "/pages/user/join";
    }

    @GetMapping("/main")
    public String mainPage(Model model, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        model.addAttribute("oauth", oAuth2User.getUserInfo());
        return "/pages/main";
    }

    @GetMapping("/main/profile")
    public String mainProfileSettingPage(){
        return "/pages/user/profileSetting";
    }

    @GetMapping("/main/group")
    public String mainGroupPage(){
        return "/pages/group/group";
    }

    @GetMapping("/main/group/{groupId}")
    public String mainGroupDetailPage(@PathVariable Long groupId){
        return "/pages/group/groupDetail";
    }

    @GetMapping("/main/group/new")
    public String mainGroupNewPage(){
        return "/pages/group/groupNew";
    }

    @GetMapping("/main/group/view")
    public String mainGroupViewPage(@RequestParam Long groupId, Model model){

        if(groupId !=null){
            GroupDto groupDto = groupService.findGroupByGroupId(groupId);
            model.addAttribute("groupInfo", groupDto);
        }

        return "/pages/group/groupView";
    }
}

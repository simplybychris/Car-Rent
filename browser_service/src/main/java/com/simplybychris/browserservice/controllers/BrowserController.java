package com.simplybychris.browserservice.controllers;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/browser")
@CrossOrigin(origins="*")
public class BrowserController {


    @Value("${salon_service_url}")
    private String salonUrl;

    @Value("${auth_service_url}")
    private String authUrl;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/cars")
    public List<Object> getCars() {
        String url = authUrl+"/cars";
        Object[] objects = restTemplate.getForObject(url, Object[].class);

        return Arrays.asList(objects);
    }

    @PostMapping("/addOrder")
    public ResponseEntity<String> addOrder(@RequestBody Map<String, Object> payload) throws JSONException {
        // create headers
        HttpHeaders headers = new HttpHeaders();
        // set `content-type` header
        headers.setContentType(MediaType.APPLICATION_JSON);
        // set `accept` header
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        System.out.println(payload);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String>response = restTemplate.postForEntity(salonUrl+"/orders", request, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Request Successful");
            System.out.println(response.getBody());
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return response;
    }

    @PostMapping("/reserveCar")
    public ResponseEntity<String> reserveCar(@RequestBody Map<String, Object> payload) throws JSONException {
        // create headers
        HttpHeaders headers = new HttpHeaders();
        // set `content-type` header
        headers.setContentType(MediaType.APPLICATION_JSON);
        // set `accept` header
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        System.out.println(payload);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String>response = restTemplate.postForEntity(salonUrl+"/cars", request, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Request Successful");
            System.out.println(response.getBody());
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return response;
    }

    @RequestMapping(value="/getClientOrder/{id}")
    public List<Object> getClientOrder(@PathVariable String id) throws JSONException {

        Object[] objects = restTemplate.getForObject(salonUrl+"/orders/user/"+id, Object[].class);

        return Arrays.asList(objects);
    }

}

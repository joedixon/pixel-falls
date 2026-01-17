<?php

test('play page can be rendered', function () {
    $response = $this->get('/play');

    $response->assertStatus(200);
});

test('play page has the correct inertia component', function () {
    $response = $this->get('/play');

    $response->assertInertia(fn ($page) => $page->component('play'));
});

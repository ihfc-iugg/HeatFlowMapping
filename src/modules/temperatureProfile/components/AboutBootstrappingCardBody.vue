<script setup></script>

<template>
  <p>This graph is calculated with bootstrapping method based on the following equation.</p>
  <math display="block">
    <mi>T</mi>
    <mo>=</mo>
    <mrow>
      <msub>
        <mi>T</mi>
        <mn>0</mn>
      </msub>
      <mo>+</mo>
      <munderover>
        <mo>∑</mo>
        <mrow>
          <mi>i</mi>
          <mo>=</mo>
          <mn>1</mn>
        </mrow>
        <mrow>
          <mo>n</mo>
        </mrow>
      </munderover>
      <mo>(</mo>
      <mfrac>
        <mrow>
          <mrow>
            <msub>
              <mi>q</mi>
              <mn>i-1</mn>
            </msub>
          </mrow>
          <mrow>
            <msub>
              <mi>&Delta;</mi>
              <mn>Zi</mn>
            </msub>
          </mrow>
        </mrow>
        <mrow>
          <msub>
            <mi>k</mi>
            <mn>i</mn>
          </msub>
        </mrow>
      </mfrac>
      <mo>-</mo>
      <mfrac>
        <mrow>
          <mrow>
            <msub>
              <mi>A</mi>
              <mn>i</mn>
            </msub>
          </mrow>
          <msup>
            <mi>
              <msub>
                <mi>&Delta;</mi>
                <mn>Zi</mn>
              </msub>
            </mi>
            <mn>2</mn>
          </msup>
        </mrow>
        <mrow>
          <msub>
            <mi>2k</mi>
            <mn>i</mn>
          </msub>
        </mrow>
      </mfrac>
      <mo>)</mo>
    </mrow>
  </math>

  <p></p>

  <math display="block">
    <mrow>
      <msub>
        <mi>q</mi>
        <mn>i-1</mn>
      </msub>
    </mrow>
    <mo>=</mo>
    <mrow>
      <msub>
        <mi>q</mi>
        <mn> i </mn>
      </msub>
    </mrow>
    <mo>+</mo>
    <mrow>
      <msub>
        <mi>A</mi>
        <mn> i </mn>
      </msub>
    </mrow>
    <mrow>
      <msub>
        <mi>&Delta;</mi>
        <mn>Zi</mn>
      </msub>
    </mrow>
  </math>

  <p></p>

  <table>
    <tr>
      <th>
        <math display="">
          <mi>T</mi>
          <mo>Temperature</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>T</mi>
            <mn>0</mn>
          </msub>
          <mo>Ground surface temperature</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>q</mi>
            <mn>i-1</mn>
          </msub>
          <mo>Heat flow at the base of the i-th depth interval</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>q</mi>
            <mn>i</mn>
          </msub>
          <mo>Heat flow at the top of the i-th depth interval</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>&Delta;</mi>
            <mn>Zi</mn>
          </msub>
          <mo>Thickness of the i-th depth interval</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>k</mi>
            <mn>i</mn>
          </msub>
          <mo>In situ thermal conductivity</mo>
        </math>
      </th>
    </tr>
    <tr>
      <th>
        <math display="">
          <msub>
            <mi>A</mi>
            <mn>i</mn>
          </msub>
          <mo>Heat production</mo>
        </math>
      </th>
    </tr>
  </table>
</template>
